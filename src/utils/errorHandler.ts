import { AppError } from '@/src/types';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorHandlers: Map<string, (error: AppError) => void> = new Map();

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  registerHandler(errorCode: string, handler: (error: AppError) => void): void {
    this.errorHandlers.set(errorCode, handler);
  }

  handleError(error: AppError): void {
    const handler = this.errorHandlers.get(error.code);
    if (handler) {
      handler(error);
    } else {
      this.handleDefaultError(error);
    }
  }

  private handleDefaultError(error: AppError): void {
    console.error('Unhandled error:', error);
    // Default error handling logic
  }

  createError(code: string, message: string, details?: any): AppError {
    return {
      code,
      message,
      details,
    };
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Common error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  CAMERA_ERROR: 'CAMERA_ERROR',
  BACKEND_ERROR: 'BACKEND_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Ticket validation failed. Please try again.',
  [ERROR_CODES.PERMISSION_ERROR]: 'Camera permission is required to scan tickets.',
  [ERROR_CODES.CAMERA_ERROR]: 'Camera is not available. Please check your device.',
  [ERROR_CODES.BACKEND_ERROR]: 'Server error. Please try again later.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
} as const;
