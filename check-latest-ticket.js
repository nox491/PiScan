// Script to fetch the latest scanned ticket and show UTC timestamp
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
async function getValidationHistory(limit = 5) {
  return apiRequest(`${BACKEND_CONFIG.API_ENDPOINTS.VALIDATION_HISTORY}?limit=${limit}`);
}

// Main function to check latest ticket
async function checkLatestTicket() {
  console.log('🎫 Checking Latest Scanned Ticket');
  console.log('================================');
  console.log('Backend URL:', BACKEND_CONFIG.BASE_URL);
  console.log('Current time (local):', new Date().toString());
  console.log('Current time (UTC):', new Date().toISOString());
  console.log('');

  try {
    const response = await getValidationHistory(5);
    
    if (!response.success || !response.history || response.history.length === 0) {
      console.error('❌ No tickets found or unexpected response format:', response);
      return;
    }

    console.log('✅ Successfully fetched', response.history.length, 'tickets');
    console.log('');

    // Show the most recent ticket first
    const latestTicket = response.history[0];
    console.log('🔍 LATEST TICKET (Most Recent):');
    console.log('Ticket ID:', latestTicket.ticketNumber);
    console.log('Customer:', latestTicket.customerEmail);
    console.log('Seat:', latestTicket.seatFormatted || latestTicket.seatNumber);
    console.log('Zone:', latestTicket.zoneName);
    console.log('Validated by:', latestTicket.validatedBy);
    console.log('');

    // Show the raw UTC timestamp from backend
    console.log('⏰ TIMESTAMP ANALYSIS:');
    console.log('Raw validatedAt (from backend):', latestTicket.validatedAt);
    console.log('Type:', typeof latestTicket.validatedAt);
    
    // Parse the timestamp
    const ticketDate = new Date(latestTicket.validatedAt);
    console.log('Parsed as Date:', ticketDate.toString());
    console.log('UTC representation:', ticketDate.toISOString());
    
    // Show what our frontend conversion would do with 6-hour offset
    console.log('');
    console.log('🔄 FRONTEND CONVERSION (with 6-hour offset):');
    console.log('Original UTC time:', ticketDate.toISOString());
    
    // Apply 6-hour offset (like our updated function does)
    const adjustedDate = new Date(ticketDate.getTime() + (6 * 60 * 60 * 1000));
    console.log('With 6-hour offset:', adjustedDate.toString());
    console.log('Adjusted time (system):', adjustedDate.toLocaleString());
    
    // Show the difference
    const offsetHours = 6;
    console.log(`Applied offset: +${offsetHours} hours`);
    
    // Calculate time difference
    const now = new Date();
    const diffMs = now.getTime() - ticketDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = diffMs / (1000 * 60 * 60);
    
    console.log('');
    console.log('⏱️  TIME DIFFERENCE:');
    console.log('Current time:', now.toString());
    console.log('Ticket time:', ticketDate.toString());
    console.log('Difference in minutes:', diffMinutes);
    console.log('Difference in hours:', diffHours.toFixed(2));
    
    if (diffMinutes < 1) {
      console.log('Relative time: Just now');
    } else if (diffMinutes < 60) {
      console.log('Relative time:', `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`);
    } else if (diffHours < 24) {
      console.log('Relative time:', `${Math.floor(diffHours)} hour${Math.floor(diffHours) === 1 ? '' : 's'} ago`);
    } else {
      console.log('Relative time:', `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) === 1 ? '' : 's'} ago`);
    }

  } catch (error) {
    console.error('❌ Failed to fetch tickets:', error.message);
    console.log('Make sure the backend is running at:', BACKEND_CONFIG.BASE_URL);
  }
}

// Run the check
checkLatestTicket();
