const fs = require('fs-extra');
const path = require('path');

const STATE_FILE = '.clawcrew-state.json';

/**
 * Load saved state from previous init session
 */
async function loadState(workspace) {
  const statePath = path.join(workspace, STATE_FILE);
  
  try {
    if (await fs.pathExists(statePath)) {
      return await fs.readJson(statePath);
    }
  } catch (error) {
    // Ignore errors, return null
  }
  
  return null;
}

/**
 * Save state for resumable sessions
 */
async function saveState(workspace, state) {
  const statePath = path.join(workspace, STATE_FILE);
  await fs.writeJson(statePath, state, { spaces: 2 });
}

/**
 * Clear saved state after successful completion
 */
async function clearState(workspace) {
  const statePath = path.join(workspace, STATE_FILE);
  
  try {
    await fs.remove(statePath);
  } catch (error) {
    // Ignore errors
  }
}

module.exports = {
  loadState,
  saveState,
  clearState
};
