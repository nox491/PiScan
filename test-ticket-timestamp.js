// Test script to fetch and analyze actual ticket timestamps from backend
const BACKEND_CONFIG = {
  BASE_URL: 'http://192.168.1.47:3002',
  API_ENDPOINTS: {
    VALIDATION_HISTORY: '/api/tickets/validation/history',
  },
};

// Helper function to build API URL
const buildApiUrl = (endpoint) => `${BACKEND_CONFIG.BASE_URL}${endpoint}`;

// API request function
async function apiRequest(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'PiScan/1.0.0',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Get validation history
async function getValidationHistory(limit = 10) {
  return apiRequest(`${BACKEND_CONFIG.API_ENDPOINTS.VALIDATION_HISTORY}?limit=${limit}`);
}

// Time conversion functions (matching your app)
function convertUtcToLocalTime(dateString) {
  if (!dateString) return new Date(dateString);
  
  try {
    const hasTimezone = dateString.includes('+') || 
                       (dateString.includes('-') && dateString.lastIndexOf('-') > 10) ||
                       dateString.endsWith('Z') ||
                       dateString.toLowerCase().includes('utc');
    
    if (hasTimezone) {
      return new Date(dateString);
    } else {
      const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
      return new Date(utcString);
    }
  } catch (error) {
    console.warn('Error converting UTC to local time:', error);
    return new Date(dateString);
  }
}

function formatRelativeTime(dateString) {
  const date = convertUtcToLocalTime(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  
  return date.toLocaleDateString();
}

// Main test function
async function testTicketTimestamps() {
  console.log('🎫 Testing Ticket Timestamps from Backend');
  console.log('==========================================');
  console.log('Backend URL:', BACKEND_CONFIG.BASE_URL);
  console.log('Current time (local):', new Date().toString());
  console.log('Current time (UTC):', new Date().toISOString());
  console.log('System timezone offset:', new Date().getTimezoneOffset(), 'minutes');
  console.log('');

  try {
    const response = await getValidationHistory(5);
    
    if (!response.success || !response.history) {
      console.error('❌ Backend response format unexpected:', response);
      return;
    }

    console.log('✅ Successfully fetched', response.history.length, 'tickets');
    console.log('');

    response.history.forEach((ticket, index) => {
      console.log(`--- Ticket ${index + 1}: ${ticket.ticketNumber} ---`);
      console.log('Raw validatedAt:', ticket.validatedAt);
      console.log('Backend validatedAtRelative:', ticket.validatedAtRelative);
      
      // Test our conversion
      const convertedDate = convertUtcToLocalTime(ticket.validatedAt);
      const ourRelativeTime = formatRelativeTime(ticket.validatedAt);
      
      console.log('Converted to local Date:', convertedDate.toString());
      console.log('Our calculated relative time:', ourRelativeTime);
      console.log('Local formatted:', convertedDate.toLocaleString());
      
      // Check if it has timezone info
      const hasTimezone = ticket.validatedAt.includes('+') || 
                         (ticket.validatedAt.includes('-') && ticket.validatedAt.lastIndexOf('-') > 10) ||
                         ticket.validatedAt.endsWith('Z') ||
                         ticket.validatedAt.toLowerCase().includes('utc');
      
      console.log('Has timezone info:', hasTimezone);
      console.log('Customer:', ticket.customerEmail);
      console.log('Validated by:', ticket.validatedBy);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Failed to fetch tickets:', error.message);
    console.log('Make sure the backend is running at:', BACKEND_CONFIG.BASE_URL);
  }
}

// Run the test
testTicketTimestamps();
