import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 90,
            paddingBottom: 20,
          },
          default: {
            height: 90,
            paddingBottom: 20,
          },
        }),
      }}>
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarButton: HapticTab,
          tabBarIcon: ({ color, focused }) => <IconSymbol size={24} name="ticket.fill" color={focused ? '#4CAF50' : color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarButton: HapticTab,
          tabBarIcon: ({ color, focused }) => <IconSymbol size={24} name="qrcode.viewfinder" color={focused ? '#4CAF50' : color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarButton: HapticTab,
          tabBarIcon: ({ color, focused }) => <IconSymbol size={24} name="gearshape.fill" color={focused ? '#4CAF50' : color} />,
        }}
      />
    </Tabs>
  );
}
