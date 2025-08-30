import { TicketValidationResult } from '@/src/types';
import { convertUtcToLocalTime } from './dataTransform';

export class ValidationUtils {
  /**
   * Validates QR code data format
   */
  static isValidQRCode(qrData: string): boolean {
    if (!qrData || typeof qrData !== 'string') {
      return false;
    }
    
    // Remove whitespace and check minimum length
    const cleanData = qrData.trim();
    if (cleanData.length < 2) {
      return false;
    }
    
    // More lenient validation - accept most printable characters
    const validPatterns = [
      /^[A-Z0-9\-_]+$/, // Alphanumeric with hyphens and underscores
      /^[a-zA-Z0-9\-_]+$/, // Case insensitive alphanumeric
      /^[0-9]+$/, // Numeric only
      /^[a-zA-Z0-9\-_\.\/\s]+$/, // Alphanumeric with dots, slashes, and spaces
      /^[A-Z0-9\-_\.\/\s]+$/, // Uppercase alphanumeric with dots, slashes, and spaces
    ];
    
    return validPatterns.some(pattern => pattern.test(cleanData));
  }

  /**
   * Sanitizes ticket validation result
   */
  static sanitizeValidationResult(result: any): TicketValidationResult {
    return {
      valid: Boolean(result?.valid),
      message: String(result?.message || 'Validation completed'),
      seatFormatted: result?.seatFormatted ? String(result.seatFormatted) : undefined,
      customerName: result?.customerName ? String(result.customerName) : undefined,
      timestamp: result?.timestamp ? String(result.timestamp) : undefined,
      error: result?.error ? String(result.error) : undefined,
      errorCode: result?.errorCode ? String(result.errorCode) : undefined,
      isDuplicate: Boolean(result?.isDuplicate),
    };
  }

  /**
   * Validates email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates URL format
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates date format
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Validates numeric input
   */
  static isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  /**
   * Validates required fields
   */
  static validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string[] {
    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        missingFields.push(field);
      }
    });
    
    return missingFields;
  }

  /**
   * Truncates text to specified length
   */
  static truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Formats time ago from timestamp (handles UTC conversion)
   */
  static formatTimeAgo(dateString: string): string {
    const date = convertUtcToLocalTime(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
}
