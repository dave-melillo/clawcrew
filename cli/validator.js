/**
 * Validator module for API keys and configuration
 */

/**
 * Validate Anthropic API key
 * In production, this would make a real API call to verify the key
 * For now, we do basic format validation
 */
async function validateApiKey(apiKey) {
  // Basic format validation
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Check if it starts with the expected prefix
  if (!apiKey.startsWith('sk-ant-')) {
    return false;
  }

  // Check minimum length (Anthropic keys are typically longer)
  if (apiKey.length < 40) {
    return false;
  }

  // In production, you would make an API call here:
  // try {
  //   const response = await fetch('https://api.anthropic.com/v1/messages', {
  //     method: 'POST',
  //     headers: {
  //       'x-api-key': apiKey,
  //       'anthropic-version': '2023-06-01',
  //       'content-type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       model: 'claude-3-haiku-20240307',
  //       max_tokens: 10,
  //       messages: [{ role: 'user', content: 'test' }]
  //     })
  //   });
  //   return response.ok;
  // } catch (error) {
  //   return false;
  // }

  // For now, simulate async validation with a small delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return true;
}

/**
 * Validate installation path
 */
function validatePath(path) {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Check if path is not empty after trimming
  if (path.trim() === '') {
    return false;
  }

  // Basic path validation (could be expanded)
  return true;
}

/**
 * Validate agent selection
 */
function validateAgents(agents) {
  if (!Array.isArray(agents) || agents.length === 0) {
    return false;
  }

  // Must include coordinator
  return agents.includes('coordinator');
}

module.exports = {
  validateApiKey,
  validatePath,
  validateAgents
};
