/**
 * Time utility functions to avoid circular dependencies
 */

/**
 * Convert UTC timestamp to local time
 * @param dateString - UTC timestamp string
 * @returns Date object converted to local timezone
 */
export function convertUtcToLocalTime(dateString: string): Date {
  if (!dateString) return new Date(dateString);
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return new Date(dateString);
    
    // Return the date as-is, since JavaScript Date automatically handles timezone conversion
    // when displaying with toLocaleString() or when comparing with local times
    return date;
  } catch (error) {
    console.warn('Error converting UTC to local time:', error);
    return new Date(dateString);
  }
}

/**
 * Format date string to readable date and time
 * @param dateString - ISO date string (may be UTC)
 * @returns Formatted date and time string (e.g., "Jan 15, 2024 at 2:30 PM")
 */
export function formatDateTime(dateString: string): string {
  const date = convertUtcToLocalTime(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Formats time ago from timestamp (globally compatible)
 * Handles timezone differences correctly for all countries and DST
 */
export function formatTimeAgo(dateString: string): string {
  // Parse the UTC date string
  const utcDate = new Date(dateString);
  const now = new Date();
  
  // Get the current timezone offset in milliseconds
  // This automatically accounts for DST and works globally
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  
  // Convert UTC date to local time
  // getTimezoneOffset() returns positive for timezones behind UTC
  const localDate = new Date(utcDate.getTime() - timezoneOffsetMs);
  
  // Calculate difference using local times
  const diffInMilliseconds = now.getTime() - localDate.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  
  // Optional debug logging (remove in production)
  if (__DEV__) {
    console.log('🕐 Time calculation debug:', {
      original: dateString,
      utcDate: utcDate.toISOString(),
      localDate: localDate.toISOString(),
      localDateFormatted: localDate.toLocaleString(),
      now: now.toLocaleString(),
      diffMs: diffInMilliseconds,
      diffMinutes: diffInMinutes,
      diffHours: Math.floor(diffInMinutes / 60),
      timezoneOffset: now.getTimezoneOffset(),
      userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}
