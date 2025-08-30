import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { CARD_STYLES, MARGIN, PADDING, TEXT_STYLES } from '@/src/constants/Styles';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: any;
  iconColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  children,
  style,
  iconColor = '#4CAF50',
  titleColor,
  subtitleColor,
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[
        CARD_STYLES.base,
        PADDING.all.lg,
        MARGIN.bottom.md,
        style
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: subtitle ? 8 : 0 }}>
        {icon && (
          <IconSymbol 
            name={icon} 
            size={24} 
            color={iconColor} 
            style={{ marginRight: 12 }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text style={[
            TEXT_STYLES.heading,
            { color: titleColor },
            { fontSize: 20, marginBottom: 4 }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              TEXT_STYLES.subheading,
              { color: subtitleColor }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      {children && (
        <View style={{ marginTop: 8 }}>
          {children}
        </View>
      )}
    </CardComponent>
  );
};
