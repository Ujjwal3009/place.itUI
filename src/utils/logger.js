// Create a new logger utility
export const logger = {
  startGroup: (name) => {
    console.group(`[PLACE.IT] ${name}`);
  },
  
  endGroup: () => {
    console.groupEnd();
  },
  
  info: (component, action, message, data = {}) => {
    console.log(`[PLACE.IT][${component}][${action}] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data
    });
  },
  
  error: (component, action, error, data = {}) => {
    console.error(`[${component}][${action}] Error: ${error.message}`, {
      timestamp: new Date().toISOString(),
      error: error.stack,
      ...data
    });
  },

  warn: (component, action, message, data = {}) => {
    console.warn(`[${component}][${action}] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data
    });
  }
}; 