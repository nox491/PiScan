// Network configuration for the ticket scanning app
export const NETWORK_CONFIG = {
  // Development environment
  development: {
    // Your computer's local IP address (update this if your IP changes)
    LOCAL_IP: '192.168.1.47',
    // Backend server port
    BACKEND_PORT: 3002,
    // Expo development server port
    EXPO_PORT: 8081,
    // Expo Go app port
    EXPO_GO_PORT: 19000,
  },
  
  // Production environment (update these when deploying)
  production: {
    // Your production server domain
    DOMAIN: 'your-production-domain.com',
    // Production backend port (usually 443 for HTTPS)
    BACKEND_PORT: 443,
    // Use HTTPS in production
    PROTOCOL: 'https',
  },
  
  // Get the appropriate backend URL based on environment
  getBackendUrl: (environment: 'development' | 'production' = 'development', useLocalhost: boolean = false) => {
    if (environment === 'production') {
      return `${NETWORK_CONFIG.production.PROTOCOL}://${NETWORK_CONFIG.production.DOMAIN}`;
    }
    
    if (useLocalhost) {
      // Use localhost for development when network connection fails
      return `http://localhost:3002`;
    }
    
    const { LOCAL_IP, BACKEND_PORT } = NETWORK_CONFIG.development;
    return `http://${LOCAL_IP}:${BACKEND_PORT}`;
  },
  
  // Get the appropriate frontend URL based on environment
  getFrontendUrl: (environment: 'development' | 'production' = 'development') => {
    if (environment === 'production') {
      return `${NETWORK_CONFIG.production.PROTOCOL}://${NETWORK_CONFIG.production.DOMAIN}`;
    }
    
    const { LOCAL_IP, EXPO_PORT } = NETWORK_CONFIG.development;
    return `http://${LOCAL_IP}:${EXPO_PORT}`;
  },
  
  // Check if running on local network
  isLocalNetwork: () => {
    // This is a simple check - you might want to implement more sophisticated detection
    return __DEV__;
  },
  
  // Get network status information
  getNetworkInfo: () => {
    return {
      isDevelopment: __DEV__,
      backendUrl: NETWORK_CONFIG.getBackendUrl(),
      frontendUrl: NETWORK_CONFIG.getFrontendUrl(),
      localIP: NETWORK_CONFIG.development.LOCAL_IP,
      backendPort: NETWORK_CONFIG.development.BACKEND_PORT,
    };
  },
};

// Export the current backend URL for easy access
export const CURRENT_BACKEND_URL = NETWORK_CONFIG.getBackendUrl();

// Helper function to update local IP address
export const updateLocalIP = (newIP: string) => {
  NETWORK_CONFIG.development.LOCAL_IP = newIP;
  return NETWORK_CONFIG.getBackendUrl();
};
