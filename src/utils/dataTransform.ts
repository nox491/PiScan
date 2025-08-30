import { TicketHistoryItem } from '@/src/types';
import { convertUtcToLocalTime, formatTimeAgo } from './timeUtils';

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
      validatedAtRelative: formatTimeAgo(originalTimestamp), // Calculate relative time from original timestamp
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

