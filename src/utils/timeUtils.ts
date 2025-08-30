/**
 * Time utility functions to avoid circular dependencies
 */

/**
 * Convert UTC timestamp to local time with 6-hour offset
 * @param dateString - UTC timestamp string
 * @returns Date object with 6-hour offset applied
 */
export function convertUtcToLocalTime(dateString: string): Date {
  if (!dateString) return new Date(dateString);
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return new Date(dateString);
    
    // Apply 6-hour offset to all timestamps
    return new Date(date.getTime() + (6 * 60 * 60 * 1000));
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
 * Formats time ago from timestamp (handles UTC conversion)
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
