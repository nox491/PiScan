import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
    BACKGROUND_COLORS,
    BORDER_RADIUS,
    BUTTON_STYLES,
    CARD_STYLES,
    FLEX,
    MARGIN,
    PADDING,
    SPACING,
    TEXT_STYLES
} from '@/src/constants/Styles';
import { useTickets } from '@/src/hooks/useTickets';
import { StatCardProps } from '@/src/types';
import { formatDateTime } from '@/src/utils/timeUtils';

export default function TicketsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const {
    tickets,
    stats,
    refreshing,
    onRefresh,
    formatTimeAgo,
  } = useTickets();

  const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => (
    <View style={[
      CARD_STYLES.withBorder,
      { 
        flex: 1, 
        minWidth: '45%', 
        padding: SPACING.lg,
        borderLeftColor: color,
        marginBottom: SPACING.md
      }
    ]}>
      <View style={[FLEX.rowCenter, MARGIN.bottom.sm]}>
        <IconSymbol name={icon} size={20} color={color} />
        <Text style={[TEXT_STYLES.subheading, { marginLeft: SPACING.sm, color: colors.text }]}>
          {title}
        </Text>
      </View>
      <Text style={[TEXT_STYLES.heading, { fontSize: 24, marginBottom: SPACING.xs, color }]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[TEXT_STYLES.caption, { color: colors.tabIconDefault }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );





  const TicketCard = ({ ticket }: { ticket: any }) => (
    <View style={[
      CARD_STYLES.withBorder,
      { 
        padding: SPACING.lg,
        borderLeftColor: ticket.valid ? '#4CAF50' : '#F44336',
        marginBottom: SPACING.md
      }
    ]}>
      <View style={[FLEX.rowBetween, MARGIN.bottom.md]}>
        <View style={{ flex: 1 }}>
          <Text style={[TEXT_STYLES.body, { fontSize: 16, marginBottom: SPACING.xs, fontWeight: '600', color: colors.text }]}>
            {ticket.ticketId}
          </Text>
          <Text style={[TEXT_STYLES.subheading, { color: colors.tabIconDefault }]}>
            {ticket.customerName}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <StatusBadge 
            status={ticket.valid ? 'valid' : 'invalid'} 
            text={ticket.valid ? 'Valid' : 'Invalid'} 
            size="sm"
          />
        </View>
      </View>
      
      <View style={{ gap: SPACING.sm, marginBottom: SPACING.md }}>
        <View style={[FLEX.rowCenter, { gap: SPACING.sm }]}>
          <IconSymbol name="chair.fill" size={16} color={colors.tint} />
          <Text style={[TEXT_STYLES.subheading, { color: colors.tabIconDefault }]}>
            Seat: {ticket.seatFormatted || ticket.seat}
          </Text>
        </View>
        <View style={[FLEX.rowCenter, { gap: SPACING.sm }]}>
          <IconSymbol name="mappin.circle.fill" size={16} color={colors.tint} />
          <Text style={[TEXT_STYLES.subheading, { color: colors.tabIconDefault }]}>{ticket.zone} Zone</Text>
        </View>
        <View style={[FLEX.rowCenter, { gap: SPACING.sm }]}>
          <IconSymbol name="clock.fill" size={16} color={colors.tint} />
          <View style={{ flex: 1 }}>
            <Text style={[TEXT_STYLES.subheading, { color: colors.tabIconDefault }]}>
              {ticket.validatedAtRelative || formatTimeAgo(ticket.validatedAt)}
            </Text>
            <Text style={[TEXT_STYLES.caption, { color: colors.tabIconDefault, opacity: 0.7, fontSize: 11 }]}>
              {formatDateTime(ticket.validatedAt)}
            </Text>
          </View>
        </View>
      </View>
      
      {ticket.message && (
        <View style={[PADDING.all.sm, { borderRadius: BORDER_RADIUS.sm, backgroundColor: BACKGROUND_COLORS.light }]}>
          <Text style={[TEXT_STYLES.caption, { color: colors.tabIconDefault, fontStyle: 'italic' }]}>{ticket.message}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={[FLEX.rowBetween, PADDING.horizontal.xl, PADDING.vertical.lg]}>
          <View>
            <Text style={[TEXT_STYLES.heading, { color: colors.text }]}>Tickets & Stats</Text>
            <Text style={[TEXT_STYLES.subheading, { marginTop: SPACING.xs, color: colors.tabIconDefault }]}>
              Validation history and statistics
            </Text>
          </View>
          <TouchableOpacity style={BUTTON_STYLES.icon} onPress={onRefresh}>
            <IconSymbol name="arrow.clockwise" size={20} color={colors.tint} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={[FLEX.rowCenter, { flexWrap: 'wrap', paddingHorizontal: SPACING.xl, gap: SPACING.md }]}>
          <StatCard
            title="Total Scans"
            value={stats.totalScans.toLocaleString()}
            subtitle="All time"
            icon="chart.bar.fill"
            color="#4CAF50"
          />
          <StatCard
            title="Valid Scans"
            value={stats.validTickets.toLocaleString()}
            subtitle="Successfully validated"
            icon="checkmark.circle.fill"
            color="#2196F3"
          />
          <StatCard
            title="Invalid Scans"
            value={stats.invalidTickets.toLocaleString()}
            subtitle="Failed validations"
            icon="xmark.circle.fill"
            color="#F44336"
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            subtitle="Overall performance"
            icon="percent"
            color="#FF9800"
          />
        </View>



        {/* Ticket History Header */}
        <View style={[MARGIN.top.xl, PADDING.horizontal.xl]}>
          <Text style={[TEXT_STYLES.heading, { fontSize: 18, marginBottom: SPACING.lg, color: colors.text }]}>
            Ticket History
          </Text>
        </View>

        {/* Tickets List */}
        <View style={[PADDING.horizontal.xl, { gap: SPACING.md, paddingBottom: SPACING.xl }]}>
          {tickets.length === 0 ? (
            <View style={[FLEX.center, { paddingVertical: SPACING.xxxl, gap: SPACING.md }]}>
              <IconSymbol name="ticket" size={48} color={colors.tint} />
              <Text style={[TEXT_STYLES.heading, { fontSize: 18, marginTop: SPACING.sm, color: colors.text }]}>
                No tickets found
              </Text>
              <Text style={[TEXT_STYLES.subheading, { textAlign: 'center', paddingHorizontal: SPACING.xl, color: colors.tabIconDefault }]}>
                No tickets have been scanned yet
              </Text>
            </View>
          ) : (
            tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
