import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';

import { validateTicket as validateTicketApi } from '@/src/config/backend';
import { ScannerState, TicketValidationResult } from '@/src/types';
import { ValidationUtils } from '@/src/utils/validation';

export const useScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<ScannerState>({
    permission: null,
    scanned: false,
    scanning: true,
    validationResult: null,
    validating: false,
    scanCount: 0,
    successCount: 0,
  });

  const cameraRef = useRef<CameraView>(null);
  const isProcessingRef = useRef(false); // Prevent multiple simultaneous validations
  const lastScannedCodeRef = useRef<string>(''); // Track last scanned code to prevent duplicates

  const updateState = useCallback((updates: Partial<ScannerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const validateTicket = useCallback(async (qrData: string): Promise<TicketValidationResult> => {
    try {
      // Real API call
      const data = await validateTicketApi(qrData, 'mobile-scanner') as any;
      return ValidationUtils.sanitizeValidationResult(data);
    } catch (error) {
      console.error('❌ Validation error:', error);
      throw new Error('Network error');
    }
  }, []);

  const handleBarCodeScanned = useCallback(async (scanResult: BarcodeScanningResult) => {
    const qrData = scanResult.data;
    
    // Prevent multiple scans of the same QR code
    if (lastScannedCodeRef.current === qrData) {
      return;
    }
    
    // Prevent multiple simultaneous validations
    if (isProcessingRef.current) {
      return;
    }
    
    // Prevent scanning if already scanned or validating
    if (state.scanned || state.validating) {
      return;
    }
    
    // Validate QR code format
    if (!ValidationUtils.isValidQRCode(qrData)) {
      updateState({
        validationResult: {
          valid: false,
          message: 'Invalid QR code format.',
        },
        scanned: true,
        scanning: false,
      });
      return;
    }

    // Set processing flag to prevent multiple validations
    isProcessingRef.current = true;
    lastScannedCodeRef.current = qrData;

    updateState({
      scanned: true,
      scanning: false,
      validating: true,
    });

    try {
      const result = await validateTicket(qrData);
      
      // Handle duplicate ticket scenarios
      if (result.errorCode === 'DUPLICATE_SCAN' || result.errorCode === 'ALREADY_VALIDATED' || result.isDuplicate) {
        // Enhance the result for duplicate tickets
        const enhancedResult = {
          ...result,
          valid: false,
          isDuplicate: true,
          message: result.message || 'This ticket has already been used',
          error: 'DUPLICATE_SCAN',
          errorCode: 'DUPLICATE_SCAN',
        };
        updateState({ validationResult: enhancedResult });
      } else {
        updateState({ validationResult: result });
      }

      if (result.valid) {
        setState(prev => ({ ...prev, successCount: prev.successCount + 1 }));
      }

      setState(prev => ({ ...prev, scanCount: prev.scanCount + 1 }));
    } catch (error) {
      console.error('Validation error:', error);
      
      updateState({
        validationResult: {
          valid: false,
          message: 'Network error during validation.',
        },
      });
    } finally {
      updateState({ validating: false });
      // Reset processing flag after a delay to allow for UI updates
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1000);
    }
  }, [state.scanned, state.validating, updateState, validateTicket]);

  const resetScanner = useCallback(() => {
    // Reset all flags and state
    isProcessingRef.current = false;
    lastScannedCodeRef.current = '';
    updateState({
      scanned: false,
      scanning: true,
      validationResult: null,
    });
  }, [updateState]);

  return {
    // State
    permission,
    state,
    
    // Refs
    cameraRef,
    
    // Actions
    requestPermission,
    handleBarCodeScanned,
    resetScanner,
    
    // Utilities
    updateState,
  };
};
