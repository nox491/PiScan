/**
 * Time utility functions to avoid circular dependencies
 */

/**
 * Convert UTC timestamp to local time
 * @param dateString - UTC timestamp string
 * @returns Date object in local timezone
 */
export function convertUtcToLocalTime(dateString: string): Date {
  if (!dateString) return new Date(dateString);
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return new Date(dateString);
    
    // Return the date as-is - JavaScript Date automatically handles timezone conversion
    // when displaying or formatting the date in the user's local timezone
    return date;
  } catch (error) {
    console.warn('Error converting UTC to local time:', error);
    return new Date(dateString);
  }
}

/**
 * Format date string to readable date and time in local timezone
 * @param dateString - ISO date string (UTC from backend)
 * @returns Formatted date and time string in local timezone (e.g., "Jan 15, 2024 at 2:30 PM")
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
 * Formats time ago from timestamp (converts UTC to local time)
 */
export function formatTimeAgo(dateString: string): string {
  const date = convertUtcToLocalTime(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}
