/**
 * ClawCrew Review & Feedback System
 *
 * The protocol supports review messages but there was no actual quality logic.
 * This module implements:
 * - Quality scoring for agent outputs
 * - Feedback generation with specific improvement suggestions
 * - Review tracking and agent performance over time
 * - Auto-escalation when quality drops below threshold
 */

import type { CrewMessage } from './protocol';

export type ReviewVerdict = 'approved' | 'needs_revision' | 'rejected' | 'escalated';

export interface ReviewResult {
  id: string;
  reviewerId: string;
  agentId: string;
  messageId: string;
  verdict: ReviewVerdict;
  score: number;            // 0-1 quality score
  feedback: string;
  issues: ReviewIssue[];
  timestamp: number;
}

export interface ReviewIssue {
  type: 'completeness' | 'accuracy' | 'tone' | 'format' | 'relevance' | 'safety';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface ReviewConfig {
  autoReviewThreshold: number;   // score below this triggers auto-review
  approvalThreshold: number;     // score above this is auto-approved
  maxRevisions: number;          // max times an agent can revise before escalation
  trackHistory: boolean;         // track review history per agent
}

const DEFAULT_CONFIG: ReviewConfig = {
  autoReviewThreshold: 0.5,
  approvalThreshold: 0.8,
  maxRevisions: 2,
  trackHistory: true,
};

export interface AgentPerformance {
  agentId: string;
  totalReviews: number;
  approvedCount: number;
  revisionCount: number;
  rejectedCount: number;
  averageScore: number;
  recentScores: number[];  // last 10 scores
  lastReviewAt: number;
}

/**
 * Review a crew message for quality.
 * Uses heuristic scoring based on content characteristics.
 */
export function reviewOutput(
  message: CrewMessage,
  originalRequest: string,
  agentRole: string,
): ReviewResult {
  const issues: ReviewIssue[] = [];
  let score = 1.0;

  // Check completeness - response should be substantive
  if (message.content.length < 20) {
    issues.push({
      type: 'completeness',
      severity: 'high',
      description: 'Response is too brief to be useful',
    });
    score -= 0.3;
  } else if (message.content.length < 50) {
    issues.push({
      type: 'completeness',
      severity: 'medium',
      description: 'Response could be more detailed',
    });
    score -= 0.15;
  }

  // Check relevance - response should relate to the request
  const requestWords = originalRequest.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const responseWords = new Set(message.content.toLowerCase().split(/\s+/));
  const relevantWords = requestWords.filter(w => responseWords.has(w));
  const relevanceRatio = requestWords.length > 0 ? relevantWords.length / requestWords.length : 0.5;

  if (relevanceRatio < 0.1) {
    issues.push({
      type: 'relevance',
      severity: 'high',
      description: 'Response does not appear to address the original request',
    });
    score -= 0.3;
  } else if (relevanceRatio < 0.2) {
    issues.push({
      type: 'relevance',
      severity: 'medium',
      description: 'Response may not fully address the request',
    });
    score -= 0.1;
  }

  // Check format - structured responses for technical roles
  const structuredRoles = ['engineer', 'analyst', 'researcher'];
  if (structuredRoles.includes(agentRole)) {
    const hasStructure = /\*\*|#{1,3}\s|\d\.\s|- /.test(message.content);
    if (!hasStructure && message.content.length > 100) {
      issues.push({
        type: 'format',
        severity: 'low',
        description: 'Technical response lacks structured formatting',
      });
      score -= 0.05;
    }
  }

  // Check tone - avoid obviously wrong patterns
  const badPatterns = [
    { pattern: /I cannot|I'm unable|I don't have/i, issue: 'Agent refusing to help without clear reason' },
    { pattern: /as an ai|as a language model/i, issue: 'Breaking character - referring to self as AI' },
  ];

  for (const { pattern, issue } of badPatterns) {
    if (pattern.test(message.content)) {
      issues.push({
        type: 'tone',
        severity: 'medium',
        description: issue,
      });
      score -= 0.15;
    }
  }

  // Check safety - basic content safety
  const safetyPatterns = [
    /password|secret|api.?key|token/i,
    /sudo\s+rm|rm\s+-rf|drop\s+table/i,
  ];

  for (const pattern of safetyPatterns) {
    if (pattern.test(message.content) && !pattern.test(originalRequest)) {
      issues.push({
        type: 'safety',
        severity: 'high',
        description: 'Response may contain sensitive information not requested',
      });
      score -= 0.2;
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(1, score));

  // Determine verdict
  let verdict: ReviewVerdict;
  if (score >= DEFAULT_CONFIG.approvalThreshold) {
    verdict = 'approved';
  } else if (score >= DEFAULT_CONFIG.autoReviewThreshold) {
    verdict = 'needs_revision';
  } else {
    verdict = 'rejected';
  }

  // Build feedback
  let feedback: string;
  if (verdict === 'approved') {
    feedback = 'Output meets quality standards.';
  } else if (issues.length > 0) {
    const highIssues = issues.filter(i => i.severity === 'high');
    const medIssues = issues.filter(i => i.severity === 'medium');
    feedback = highIssues.length > 0
      ? `Critical issues: ${highIssues.map(i => i.description).join('; ')}`
      : `Improvement needed: ${medIssues.map(i => i.description).join('; ')}`;
  } else {
    feedback = 'Output quality is below threshold.';
  }

  return {
    id: `review_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    reviewerId: 'system',
    agentId: message.from,
    messageId: message.id,
    verdict,
    score,
    feedback,
    issues,
    timestamp: Date.now(),
  };
}

/**
 * Track agent performance across reviews.
 */
export class ReviewTracker {
  private performance: Map<string, AgentPerformance> = new Map();
  private reviewHistory: ReviewResult[] = [];
  private config: ReviewConfig;

  constructor(config: Partial<ReviewConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Record a review result */
  recordReview(review: ReviewResult): void {
    // Update review history
    this.reviewHistory.push(review);

    // Update agent performance
    let perf = this.performance.get(review.agentId);
    if (!perf) {
      perf = {
        agentId: review.agentId,
        totalReviews: 0,
        approvedCount: 0,
        revisionCount: 0,
        rejectedCount: 0,
        averageScore: 0,
        recentScores: [],
        lastReviewAt: 0,
      };
      this.performance.set(review.agentId, perf);
    }

    perf.totalReviews++;
    perf.lastReviewAt = review.timestamp;

    switch (review.verdict) {
      case 'approved':
        perf.approvedCount++;
        break;
      case 'needs_revision':
        perf.revisionCount++;
        break;
      case 'rejected':
      case 'escalated':
        perf.rejectedCount++;
        break;
    }

    // Update rolling scores
    perf.recentScores.push(review.score);
    if (perf.recentScores.length > 10) {
      perf.recentScores.shift();
    }

    // Recalculate average
    perf.averageScore = perf.recentScores.reduce((sum, s) => sum + s, 0) / perf.recentScores.length;
  }

  /** Get performance for an agent */
  getPerformance(agentId: string): AgentPerformance | undefined {
    return this.performance.get(agentId);
  }

  /** Get all agent performances sorted by score */
  getLeaderboard(): AgentPerformance[] {
    return Array.from(this.performance.values())
      .sort((a, b) => b.averageScore - a.averageScore);
  }

  /** Check if an agent should be auto-escalated (consistently low quality) */
  shouldEscalate(agentId: string): boolean {
    const perf = this.performance.get(agentId);
    if (!perf || perf.recentScores.length < 3) return false;

    // Escalate if last 3 reviews were all below threshold
    const recent = perf.recentScores.slice(-3);
    return recent.every(s => s < this.config.autoReviewThreshold);
  }

  /** Get review history for an agent */
  getHistory(agentId: string): ReviewResult[] {
    return this.reviewHistory.filter(r => r.agentId === agentId);
  }

  /** Get recent reviews across all agents */
  getRecentReviews(count: number = 10): ReviewResult[] {
    return this.reviewHistory.slice(-count);
  }

  /** Get crew-wide quality stats */
  getCrewQuality(): {
    averageScore: number;
    totalReviews: number;
    approvalRate: number;
    topPerformer: string | null;
    bottomPerformer: string | null;
  } {
    const perfs = Array.from(this.performance.values());
    if (perfs.length === 0) {
      return {
        averageScore: 0,
        totalReviews: 0,
        approvalRate: 0,
        topPerformer: null,
        bottomPerformer: null,
      };
    }

    const totalReviews = perfs.reduce((sum, p) => sum + p.totalReviews, 0);
    const totalApproved = perfs.reduce((sum, p) => sum + p.approvedCount, 0);
    const avgScore = perfs.reduce((sum, p) => sum + p.averageScore, 0) / perfs.length;

    const sorted = [...perfs].sort((a, b) => b.averageScore - a.averageScore);

    return {
      averageScore: avgScore,
      totalReviews,
      approvalRate: totalReviews > 0 ? totalApproved / totalReviews : 0,
      topPerformer: sorted[0]?.agentId ?? null,
      bottomPerformer: sorted[sorted.length - 1]?.agentId ?? null,
    };
  }
}
