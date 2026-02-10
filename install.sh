#!/bin/bash
set -e

echo "🦞 Installing ClawCrew..."

# Check prerequisites
command -v openclaw >/dev/null 2>&1 || { echo "❌ OpenClaw not installed. Get it at https://openclaw.ai"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not installed"; exit 1; }

# Check config
if [ ! -f "config.env" ]; then
    echo "❌ config.env not found. Copy config.example.env and fill in your keys."
    exit 1
fi

# Load config
source config.env

# Verify required keys
if [ -z "$ANTHROPIC_API_KEY" ] || [ "$ANTHROPIC_API_KEY" = "your-anthropic-key" ]; then
    echo "❌ ANTHROPIC_API_KEY not set in config.env"
    exit 1
fi

# Create OpenClaw workspace structure
WORKSPACE="${OPENCLAW_WORKSPACE:-$HOME/.openclaw/clawcrew}"
mkdir -p "$WORKSPACE"

# Copy personas
echo "📋 Installing personas..."
mkdir -p "$WORKSPACE/personas"
cp -r personas/* "$WORKSPACE/personas/" 2>/dev/null || true

# Copy skills
echo "🛠️ Installing skills..."
mkdir -p "$WORKSPACE/skills"
cp -r skills/* "$WORKSPACE/skills/" 2>/dev/null || true

# Copy templates
echo "📝 Installing templates..."
mkdir -p "$WORKSPACE/templates"
cp -r templates/* "$WORKSPACE/templates/" 2>/dev/null || true

# Create memory structure
echo "🧠 Setting up memory..."
mkdir -p "$WORKSPACE/memory"

# Create global env for skills that need it
mkdir -p "$HOME/.config/env"
cat > "$HOME/.config/env/global.env" << ENVEOF
# ClawCrew global environment
X_BEARER_TOKEN=${X_BEARER_TOKEN:-}
VERCEL_TOKEN=${VERCEL_TOKEN:-}
ENVEOF

# Install mission control dependencies
if [ -d "skills/mission-control" ]; then
    echo "🎯 Setting up Mission Control..."
    cd skills/mission-control
    npm install --silent
    cd ../..
fi

echo ""
echo "✅ ClawCrew installed!"
echo ""
echo "📍 Workspace: $WORKSPACE"
echo ""
echo "Next steps:"
echo "  1. Run: openclaw"
echo "  2. Say: 'Hey Gambit, what can you do?'"
echo ""
