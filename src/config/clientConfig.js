// Client-specific module configuration
// This file should be modified for each client deployment

export const CLIENT_CONFIG = {
  // Current client identifier - change this for different deployments
  clientId: process.env.REACT_APP_CLIENT_ID || 'defaultNoAccess',

  // Module availability per client
  clients: {
    // Default client - no modules enabled, fallback to this if no client info
    //entered in the .env file
    defaultNoAccess: {
      modules: {
        dashboard: true, //made this true to avoid re-render error on startup
        employees: false,
        attendance: false,
        leave: false,
        performance: false,
        payroll: false,
        admin: false,
        recruitment: false
      }
    },
    //All modules enabled
    defaultAllAccess: {
      modules: {
        dashboard: true,
        employees: true,
        attendance: true,
        leave: true,
        performance: true,
        payroll: true,
        admin: true,
        recruitment: false
      }
    },

    // Client A - only employee management and attendance
    clientA: {
      modules: {
        dashboard: true,
        employees: true,
        attendance: true,
        leave: false,
        recruitment: false,
        performance: false,
        payroll: false,
        admin: false
      }
    },

    // Add more clients as needed recruitment should always be set to 'false' explicitly
    // clientB: {
    //   modules: {
    //     dashboard: true,
    //     employees: false,
    //     attendance: true,
    //     leave: true,
    //     recruitment: false,
    //     performance: false,
    //     payroll: false,
    //     admin: false
    //   }
    // }
  }
};

// Helper functions
export const getCurrentClientConfig = () => {
  const clientId = CLIENT_CONFIG.clientId;
  return CLIENT_CONFIG.clients[clientId] || CLIENT_CONFIG.clients.default;
};

export const isModuleEnabled = (moduleName) => {
  const clientConfig = getCurrentClientConfig();
  return clientConfig.modules[moduleName] !== false;
};

export const getEnabledModules = () => {
  const clientConfig = getCurrentClientConfig();
  return Object.keys(clientConfig.modules).filter(module => clientConfig.modules[module]);
};

export const getDisabledModules = () => {
  const clientConfig = getCurrentClientConfig();
  return Object.keys(clientConfig.modules).filter(module => !clientConfig.modules[module]);
};
