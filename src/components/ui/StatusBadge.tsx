import React from 'react';
import { Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { BORDER_RADIUS } from '@/src/constants/Styles';

interface StatusBadgeProps {
  status: 'valid' | 'invalid' | 'pending' | 'success' | 'error' | 'warning';
  text: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const STATUS_CONFIG = {
  valid: {
    backgroundColor: '#D4EDDA',
    borderColor: '#C3E6CB',
    textColor: '#155724',
    iconColor: '#155724',
    icon: 'checkmark.circle.fill',
  },
  invalid: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    textColor: '#721C24',
    iconColor: '#721C24',
    icon: 'xmark.circle.fill',
  },
  pending: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    textColor: '#856404',
    iconColor: '#856404',
    icon: 'clock.fill',
  },
  success: {
    backgroundColor: '#D4EDDA',
    borderColor: '#C3E6CB',
    textColor: '#155724',
    iconColor: '#155724',
    icon: 'checkmark.circle.fill',
  },
  error: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    textColor: '#721C24',
    iconColor: '#721C24',
    icon: 'exclamationmark.triangle.fill',
  },
  warning: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    textColor: '#856404',
    iconColor: '#856404',
    icon: 'exclamationmark.triangle.fill',
  },
};

const SIZE_CONFIG = {
  sm: {
    padding: 6,
    fontSize: 10,
    iconSize: 12,
  },
  md: {
    padding: 8,
    fontSize: 12,
    iconSize: 14,
  },
  lg: {
    padding: 12,
    fontSize: 14,
    iconSize: 16,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  size = 'md',
  showIcon = true,
}) => {
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];
  
  if (!config) {
    return null;
  }

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: sizeConfig.padding,
      backgroundColor: config.backgroundColor,
      borderWidth: 1,
      borderColor: config.borderColor,
      borderRadius: BORDER_RADIUS.md,
    }}>
      {showIcon && (
        <IconSymbol
          name={config.icon}
          size={sizeConfig.iconSize}
          color={config.iconColor}
          style={{ marginRight: 6 }}
        />
      )}
      <Text style={{
        fontSize: sizeConfig.fontSize,
        fontWeight: '600',
        color: config.textColor,
      }}>
        {text}
      </Text>
    </View>
  );
};
