const fs = require('fs-extra');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../../templates');

/**
 * Get list of available persona templates
 */
async function getPersonas() {
  const personasDir = path.join(TEMPLATES_DIR, 'personas');
  const dirs = await fs.readdir(personasDir);
  
  const personas = [];
  
  for (const dir of dirs) {
    const personaPath = path.join(personasDir, dir);
    const stat = await fs.stat(personaPath);
    
    if (stat.isDirectory()) {
      // Read SOUL.md to get description
      const soulPath = path.join(personaPath, 'SOUL.md');
      if (await fs.pathExists(soulPath)) {
        const soul = await fs.readFile(soulPath, 'utf-8');
        const firstLine = soul.split('\n')[0].replace(/^#\s*/, '').replace('SOUL.md - ', '');
        
        personas.push({
          id: dir,
          name: dir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          description: firstLine,
          path: personaPath
        });
      }
    }
  }
  
  return personas;
}

/**
 * Get base template files
 */
async function getBaseTemplates() {
  const baseDir = path.join(TEMPLATES_DIR, 'base');
  return {
    AGENTS: path.join(baseDir, 'AGENTS.md'),
    HEARTBEAT: path.join(baseDir, 'HEARTBEAT.md'),
    MEMORY: path.join(baseDir, 'MEMORY.md')
  };
}

/**
 * Apply a persona template to workspace
 */
async function applyPersona(personaId, workspace, customizations = {}) {
  const personas = await getPersonas();
  const persona = personas.find(p => p.id === personaId);
  
  if (!persona) {
    throw new Error(`Persona '${personaId}' not found`);
  }
  
  // Copy persona files
  const files = await fs.readdir(persona.path);
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const srcPath = path.join(persona.path, file);
      const destPath = path.join(workspace, file);
      
      let content = await fs.readFile(srcPath, 'utf-8');
      
      // Apply customizations
      content = applyCustomizations(content, customizations);
      
      await fs.writeFile(destPath, content);
    }
  }
  
  return persona;
}

/**
 * Apply base templates (non-persona files)
 */
async function applyBaseTemplates(workspace) {
  const base = await getBaseTemplates();
  
  for (const [name, srcPath] of Object.entries(base)) {
    const destPath = path.join(workspace, path.basename(srcPath));
    await fs.copy(srcPath, destPath);
  }
}

/**
 * Replace template variables in content
 */
function applyCustomizations(content, customizations) {
  let result = content;
  
  // Replace common placeholders - do these in order to avoid conflicts
  const replacements = [
    // Template variables {{}}
    { pattern: '{{agent_name}}', value: customizations.agentName || 'Assistant' },
    { pattern: '{{user_name}}', value: customizations.userName || customizations.firstName || '[Your name]' },
    { pattern: '{{first_name}}', value: customizations.firstName || '[Your name]' },
    { pattern: '{{preferred_name}}', value: customizations.preferredName || customizations.firstName || '[Your name]' },
    { pattern: '{{timezone}}', value: customizations.timezone || '[Your timezone]' },
    { pattern: '{{user_context}}', value: customizations.userContext || '' },
    
    // Bracketed placeholders []
    { pattern: '[Your name]', value: customizations.userName || customizations.firstName || '[Your name]' },
    { pattern: '[Nickname, if any]', value: customizations.preferredName !== customizations.firstName ? customizations.preferredName : '' },
    { pattern: '[e.g., America/New_York]', value: customizations.timezone || '[e.g., America/New_York]' }
  ];
  
  for (const { pattern, value } of replacements) {
    if (value) {  // Only replace if we have a value
      // Escape special regex characters in pattern
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.split(pattern).join(value);
    }
  }
  
  return result;
}

module.exports = {
  getPersonas,
  getBaseTemplates,
  applyPersona,
  applyBaseTemplates,
  applyCustomizations
};
