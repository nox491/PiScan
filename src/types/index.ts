// Core application types
export interface TicketValidationResult {
  valid: boolean;
  message: string;
  seatFormatted?: string; // Formatted seat information (e.g., "4th row, 4th seat")
  customerName?: string;
  timestamp?: string;
  error?: string;
  errorCode?: string;
  // Additional fields for duplicate tickets
  isDuplicate?: boolean;
}

export interface StatsData {
  totalScans: number;
  validTickets: number;
  invalidTickets: number;
  successRate: number;
}

export interface TicketHistoryItem {
  id: string;
  ticketId: string;
  customerName: string;
  seat: string;
  seatFormatted?: string; // Add formatted seat information
  zone: string;
  valid: boolean;
  validatedAt: string;
  validatedAtRelative?: string; // Backend's pre-formatted relative time
  validatedBy: string;
  message: string;
}

// Component prop types
export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
}



export interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationStatsResponse {
  totalScans: number;
  validTickets: number;
  invalidTickets: number;
  successRate: number;
}

export interface ValidationHistoryResponse {
  tickets: TicketHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export type ErrorHandler = (error: AppError) => void;

// State types
export interface AppState {
  isLoading: boolean;
  error: AppError | null;
  lastUpdated: Date | null;
}

export interface ScannerState {
  permission: boolean | null;
  scanned: boolean;
  scanning: boolean;
  validationResult: TicketValidationResult | null;
  validating: boolean;
  scanCount: number;
  successCount: number;
}

export const SCANNER_SETTINGS = {
  SCAN_AREA_SIZE_RATIO: 0.7,
  BARCODE_TYPES: ['qr', 'code128', 'code39'] as const,
} as const;
