import { useCallback, useEffect, useState } from 'react';

import { getValidationHistory, getValidationStats } from '@/src/config/backend';
import { StatsData, TicketHistoryItem } from '@/src/types';
import {
    transformValidationHistory,
    transformValidationStats
} from '@/src/utils/dataTransform';
import { ERROR_CODES, errorHandler } from '@/src/utils/errorHandler';
import { ValidationUtils } from '@/src/utils/validation';

export const useTickets = () => {
  const [tickets, setTickets] = useState<TicketHistoryItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalScans: 0,
    validTickets: 0,
    invalidTickets: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTicketHistory = useCallback(async () => {
    try {
      const history = await getValidationHistory(50) as any;
      const transformedTickets = transformValidationHistory(history);
      setTickets(transformedTickets);
    } catch {
      const errorObj = errorHandler.createError(
        ERROR_CODES.BACKEND_ERROR,
        'Failed to load ticket history'
      );
      errorHandler.handleError(errorObj);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const backendStats = await getValidationStats() as any;
      const transformedStats = transformValidationStats(backendStats);
      setStats(transformedStats);
    } catch {
      const errorObj = errorHandler.createError(
        ERROR_CODES.BACKEND_ERROR,
        'Failed to load statistics'
      );
      errorHandler.handleError(errorObj);
    }
  }, []);

  const loadData = useCallback(async () => {
    await Promise.all([loadTicketHistory(), loadStats()]);
  }, [loadTicketHistory, loadStats]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  }, [loadData]);

  const formatTimeAgo = useCallback((dateString: string) => {
    return ValidationUtils.formatTimeAgo(dateString);
  }, []);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  return {
    // State
    tickets,
    stats,
    loading,
    refreshing,
    
    // Actions
    loadData,
    onRefresh,
    formatTimeAgo,
  };
};
