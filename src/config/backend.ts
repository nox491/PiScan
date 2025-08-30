// Backend configuration for the ticket scanning app
export const BACKEND_CONFIG = {
  // Base URL for the backend server
  BASE_URL: 'http://192.168.1.47:3002',
  
  // API endpoints - matching backend exactly
  API_ENDPOINTS: {
    HEALTH: '/api/health',
    VALIDATE_TICKET: '/api/tickets/validate',
    VALIDATION_HISTORY: '/api/tickets/validation/history',
    VALIDATION_STATS: '/api/tickets/validation/stats',
  },
  
  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 30000, // 30 seconds is sufficient
  
  // Retry configuration
  RETRY_CONFIG: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Check if endpoint already contains the base URL to avoid duplication
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  const fullUrl = `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
  return fullUrl;
};

// Helper function to get the full URL for a specific endpoint
export const getApiUrl = (endpointKey: keyof typeof BACKEND_CONFIG.API_ENDPOINTS): string => {
  return buildApiUrl(BACKEND_CONFIG.API_ENDPOINTS[endpointKey]);
};

// Default headers for API requests
export const getDefaultHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
      'User-Agent': 'PiScan/1.0.0',
});

// API request wrapper with error handling and retry logic
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint);
  const headers = { ...getDefaultHeaders(), ...options.headers };
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= BACKEND_CONFIG.RETRY_CONFIG.MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), BACKEND_CONFIG.REQUEST_TIMEOUT);
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // For ticket validation, 400 responses can contain valid JSON with validation results
      if (!response.ok) {
        // Try to parse the response as JSON first
        try {
          const errorResponseData = await response.json();
          
          // If it's a validation response (contains 'valid' field), return it
          if (errorResponseData.hasOwnProperty('valid')) {
            return errorResponseData;
          }
          
          // Otherwise, throw the error
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponseData.message || errorResponseData.error || 'Unknown error'}`);
        } catch {
          // If we can't parse JSON, throw the original error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const responseData = await response.json();
      return responseData;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < BACKEND_CONFIG.RETRY_CONFIG.MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, BACKEND_CONFIG.RETRY_CONFIG.RETRY_DELAY));
      }
    }
  }
  
  // All attempts failed
  if (lastError?.name === 'AbortError') {
    throw new Error('Request timeout after all retries');
  }
  
  throw new Error(`Network error after ${BACKEND_CONFIG.RETRY_CONFIG.MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`);
};

// Specific API functions - matching backend response format exactly
export const validateTicket = async (qrCode: string, validatedBy: string) => {
  // Call the backend for ticket validation
  return apiRequest(getApiUrl('VALIDATE_TICKET'), {
    method: 'POST',
    body: JSON.stringify({ qrCode, validatedBy }),
  });
};

export const getValidationHistory = async (limit: number = 100) => {
  return apiRequest(`${BACKEND_CONFIG.API_ENDPOINTS.VALIDATION_HISTORY}?limit=${limit}`);
};

export const getValidationStats = async () => {
  return apiRequest(getApiUrl('VALIDATION_STATS'));
};

export const checkBackendHealth = async () => {
  return apiRequest(getApiUrl('HEALTH'));
};
