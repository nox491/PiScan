import { TicketHistoryItem } from '@/src/types';
import { ValidationUtils } from '@/src/utils/validation';

/**
 * Utility functions for data transformation to eliminate duplication across hooks
 */

/**
 * Transform backend validation history to frontend format
 * @param backendHistory - Raw backend validation history
 * @returns Transformed ticket history items
 */
export function transformValidationHistory(backendHistory: any): TicketHistoryItem[] {
  if (!backendHistory || !backendHistory.success || !Array.isArray(backendHistory.history)) {
    return [];
  }

  // Debug: Log basic info about the data received
  console.log('🔍 Backend validation history:', {
    success: backendHistory.success,
    count: backendHistory.history?.length || 0,
    firstTicket: backendHistory.history?.[0]?.ticketNumber
  });

  return backendHistory.history.map((entry: any) => {
    // Keep the original timestamp string for display
    const originalTimestamp = entry.validatedAt;
    
    const transformed = {
      id: entry.ticketNumber,
      ticketId: entry.ticketNumber,
      customerName: entry.customerEmail || 'Unknown',
      seat: entry.seatNumber,
      seatFormatted: entry.seatFormatted,
      zone: entry.zoneName,
      valid: true, // All tickets in history are valid (used)
      validatedAt: originalTimestamp,
      validatedAtRelative: ValidationUtils.formatTimeAgo(originalTimestamp), // Calculate relative time from original timestamp
      validatedBy: entry.validatedBy,
      message: `Validated by ${entry.validatedBy}`
    };
    
    // Debug: Log time conversion info
    const localDate = convertUtcToLocalTime(originalTimestamp);
    console.log('🔍 Ticket converted:', {
      id: transformed.ticketId,
      originalUTC: entry.validatedAt,
      localTime: localDate.toLocaleString(),
      relativeTime: transformed.validatedAtRelative
    });
    
    return transformed;
  });
}

/**
 * Transform backend stats to frontend format
 * @param backendStats - Raw backend statistics
 * @returns Transformed stats data
 */
export function transformValidationStats(backendStats: any) {
  if (!backendStats || !backendStats.success || !backendStats.data) {
    return {
      totalScans: 0,
      validTickets: 0,
      invalidTickets: 0,
      successRate: 0,
    };
  }

  return {
    totalScans: backendStats.data.totalScans || 0,
    validTickets: backendStats.data.validTickets || 0,
    invalidTickets: backendStats.data.invalidTickets || 0,
    successRate: backendStats.data.successRate || 0,
  };
}



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