import React, { useState } from 'react';
import { Alert, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BACKEND_CONFIG, checkBackendHealth, getValidationHistory } from '@/src/config/backend';
import { transformValidationHistory } from '@/src/utils/dataTransform';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');


  React.useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    setBackendStatus('checking');
    try {
      await checkBackendHealth();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const SettingItem = ({ title, subtitle, icon, onPress, rightElement, showChevron = true }: SettingItemProps) => (
    <TouchableOpacity 
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: 'rgba(0,0,0,0.05)',
        backgroundColor: colors.card
      }} 
      onPress={onPress} 
      disabled={!onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ 
          width: 36, 
          height: 36, 
          borderRadius: 8, 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginRight: 12,
          backgroundColor: colors.tint + '20'
        }}>
          <IconSymbol name={icon} size={20} color={colors.tint} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, marginBottom: 2, fontWeight: '600', color: colors.text }}>{title}</Text>
          {subtitle && <Text style={{ fontSize: 14, opacity: 0.6, color: colors.tabIconDefault }}>{subtitle}</Text>}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {rightElement}
        {showChevron && onPress && (
          <IconSymbol name="chevron.right" size={16} color={colors.tint} />
        )}
      </View>
    </TouchableOpacity>
  );

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return '#4CAF50';
      case 'disconnected': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getBackendStatusText = () => {
    switch (backendStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      default: return 'Checking...';
    }
  };

  const handleBackendUrlPress = () => {
    Alert.alert(
      'Backend URL',
      `Current backend URL:\n${BACKEND_CONFIG.BASE_URL}`,
      [
        { text: 'Copy URL', onPress: () => {/* Copy to clipboard */} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleTestConnection = () => {
    checkBackendConnection();
  };

  const handleExportData = async () => {
    try {

      // Fetch ticket history from backend
      const history = await getValidationHistory(1000) as any; // Get up to 1000 tickets
      if (!history || !history.success || !history.history) {
        throw new Error('Failed to fetch ticket history');
      }

      // Transform the data
      const tickets = transformValidationHistory(history);
      
      if (tickets.length === 0) {
        Alert.alert(
          'No Data',
          'No tickets found to export.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Generate CSV content
      const csvHeaders = [
        'Ticket ID',
        'Customer Email', 
        'Seat',
        'Zone',
        'Status',
        'Validated At',
        'Validated By',
        'Message'
      ].join(',');

      const csvRows = tickets.map(ticket => [
        ticket.ticketId,
        `"${ticket.customerName}"`, // Wrap in quotes to handle commas in names
        ticket.seat,
        ticket.zone,
        ticket.valid ? 'Valid' : 'Invalid',
        ticket.validatedAt,
        ticket.validatedBy,
        `"${ticket.message}"` // Wrap in quotes to handle commas
      ].join(','));

      const csvContent = [csvHeaders, ...csvRows].join('\n');
      
      // Create filename with current date
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      const filename = `ticket_history_${dateStr}_${timeStr}.csv`;

      // Share the CSV content as text (user can save as .csv)
      await Share.share({
        title: 'Ticket History Export',
        message: csvContent
      });

    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        'Export Failed',
        'Failed to export ticket data. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };



  const handleAbout = () => {
    Alert.alert(
      'About',
      'PiScan\nVersion 1.0.0\n\nA modern ticket validation system for Pithagorio Odeum.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>Settings</Text>
          <Text style={{ fontSize: 14, opacity: 0.7, marginTop: 4, color: colors.tabIconDefault }}>Configure your ticket scanner</Text>
        </View>

        {/* Backend Connection */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: colors.text }}>Backend Connection</Text>
          <View style={{ borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <SettingItem
              title="Backend URL"
              subtitle={BACKEND_CONFIG.BASE_URL}
              icon="server.rack"
              onPress={handleBackendUrlPress}
            />
            <SettingItem
              title="Connection Status"
              subtitle={getBackendStatusText()}
              icon="network"
              rightElement={
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getBackendStatusColor() }} />
              }
              showChevron={false}
            />
            <SettingItem
              title="Test Connection"
              subtitle="Verify backend connectivity"
              icon="arrow.clockwise"
              onPress={handleTestConnection}
            />
          </View>
        </View>



        {/* Data Management */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: colors.text }}>Data Management</Text>
          <View style={{ borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <SettingItem
              title="Export Data"
              subtitle="Download ticket history"
              icon="square.and.arrow.up"
              onPress={handleExportData}
            />

          </View>
        </View>

        {/* App Info */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: colors.text }}>App Information</Text>
          <View style={{ borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <SettingItem
              title="About"
              subtitle="Version 1.0.0"
              icon="info.circle"
              onPress={handleAbout}
            />
            <SettingItem
              title="Privacy Policy"
              subtitle="Read our privacy policy"
              icon="hand.raised.fill"
              onPress={() => {/* Navigate to privacy policy */}}
            />
            <SettingItem
              title="Terms of Service"
              subtitle="Read our terms of service"
              icon="doc.text"
              onPress={() => {/* Navigate to terms */}}
            />
          </View>
        </View>

        {/* Version Info */}
        <View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 14, opacity: 0.6, marginBottom: 4, color: colors.tabIconDefault }}>PiScan v1.0.0</Text>
          <Text style={{ fontSize: 12, opacity: 0.4, color: colors.tabIconDefault }}>Built with React Native & Expo</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
