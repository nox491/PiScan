// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'qrcode.viewfinder': 'qr-code-scanner',
  'clock.fill': 'schedule',
  'chart.bar.fill': 'bar-chart',
  'gearshape.fill': 'settings',
  'person.fill': 'person',
  'bell.fill': 'notifications',
  'checkmark.circle.fill': 'check-circle',
  'xmark.circle.fill': 'cancel',
  'bolt.fill': 'flash-on',
  'bolt.slash.fill': 'flash-off',
  'camera.fill': 'camera-alt',
  'keyboard': 'keyboard',
  'arrow.clockwise': 'refresh',
  'magnifyingglass': 'search',
  'at': 'alternate-email',
  'person.badge.plus.fill': 'person-add',
  'message.fill': 'message',
  'envelope.fill': 'email',
  'phone.fill': 'phone',
  'location.fill': 'location-on',
  'calendar': 'calendar-today',
  'lock.fill': 'lock',
  'hand.raised.fill': 'security',
  'link': 'link',
  'globe': 'language',
  'dollarsign.circle.fill': 'attach-money',
  'shield.fill': 'security',
  'clock.arrow.circlepath': 'history',
  'desktopcomputer': 'computer',
  'square.and.arrow.up': 'share',
  'trash.fill': 'delete',
  'questionmark.circle.fill': 'help',
  'exclamationmark.triangle.fill': 'warning',
  'doc.text.fill': 'description',
  'server.rack': 'dns',
  'person.badge.key.fill': 'vpn-key',
  'network': 'network-check',
  'speaker.wave.2.fill': 'volume-up',
  'iphone.radiowaves.left.and.right': 'vibration',
  'hammer.fill': 'build',
  'info.circle.fill': 'info',
  'number.circle.fill': 'looks-one',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
