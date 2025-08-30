import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useScanner } from '@/src/hooks/useScanner';
import { CameraView } from 'expo-camera';
import React from 'react';
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const SCAN_AREA_SIZE = Math.min(screenWidth * 0.6, 300);

export default function ScannerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const {
    permission,
    requestPermission,
    cameraRef,
    state,
    handleBarCodeScanned,
    resetScanner,
  } = useScanner();

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 20, marginBottom: 30, color: colors.text }}>
            Requesting camera permission...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <IconSymbol name="camera.fill" size={64} color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'} />
          <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 20, marginBottom: 30, color: colors.text }}>
            Camera access is required to scan tickets
          </Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 30,
              paddingVertical: 15,
              borderRadius: 12,
              backgroundColor: '#4CAF50',
            }}
            onPress={requestPermission}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingBottom: 100 }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>Scanner</Text>
          <Text style={{ fontSize: 14, opacity: 0.7, marginTop: 2, color: colors.tabIconDefault }}>QR Code Ticket Validation</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <IconSymbol name="qrcode.viewfinder" size={16} color={colors.tint} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.tabIconDefault }}>{state.scanCount}</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <IconSymbol name="checkmark.circle.fill" size={16} color="#4CAF50" />
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.tabIconDefault }}>{state.successCount}</Text>
          </View>
        </View>
      </View>

      {/* Camera View */}
      {state.scanning && !state.validationResult && (
        <View style={{ height: 400, margin: 20, borderRadius: 20, overflow: 'hidden' }}>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={state.validating ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'code128', 'code39'],
            }}
          >
            {/* Scan Area Overlay */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: SCAN_AREA_SIZE, height: SCAN_AREA_SIZE, position: 'relative' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderColor: '#fff', borderWidth: 3, borderBottomWidth: 0, borderRightWidth: 0 }} />
                <View style={{ position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderColor: '#fff', borderWidth: 3, borderBottomWidth: 0, borderLeftWidth: 0 }} />
                <View style={{ position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderColor: '#fff', borderWidth: 3, borderTopWidth: 0, borderRightWidth: 0 }} />
                <View style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderColor: '#fff', borderWidth: 3, borderTopWidth: 0, borderLeftWidth: 0 }} />
              </View>
              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3, marginBottom: 4 }}>
                  {state.validating ? 'Processing ticket...' : 'Position QR code within frame'}
                </Text>
                <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center', textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3, opacity: 0.8 }}>
                  {state.validating ? 'Please wait' : 'Hold steady for best results'}
                </Text>
              </View>
            </View>
            
            {/* Processing Overlay */}
            {state.validating && (
              <View style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <View style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  padding: 20, 
                  borderRadius: 12, 
                  alignItems: 'center' 
                }}>
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
                    Processing Ticket
                  </Text>
                  <Text style={{ color: '#fff', fontSize: 14, opacity: 0.8, textAlign: 'center' }}>
                    Camera paused to prevent multiple scans
                  </Text>
                </View>
              </View>
            )}
          </CameraView>
        </View>
      )}

      {/* Validation Result */}
      {state.validationResult && (
        <View style={{ margin: 20, marginBottom: 120, padding: 20, borderRadius: 16, backgroundColor: colors.card, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
          <View style={{ 
            padding: 20, 
            borderRadius: 12, 
            borderWidth: 2, 
            borderColor: state.validationResult.valid ? '#4CAF50' : '#F44336',
            backgroundColor: state.validationResult.valid ? '#4CAF50' + '10' : '#F44336' + '10'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <IconSymbol
                name={state.validationResult.valid ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                size={48}
                color={state.validationResult.valid ? '#4CAF50' : '#F44336'}
              />
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: state.validationResult.valid ? '#4CAF50' : '#F44336' }}>
                {state.validationResult.valid ? 'Ticket Valid' : 'Ticket Invalid'}
              </Text>
            </View>
            
            {/* Success Warning - Shows for valid tickets */}
            {state.validationResult.valid && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: 10, 
                marginBottom: 20,
                padding: 14,
                backgroundColor: '#D4EDDA',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#C3E6CB'
              }}>
                <IconSymbol name="checkmark.circle.fill" size={22} color="#155724" />
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#155724', flex: 1 }}>
                  This ticket is valid and can be used for entry.
                </Text>
              </View>
            )}

            {/* Ticket Information - Shows for all ticket types */}
            <View style={{ gap: 12, marginBottom: 20 }}>
              {/* Duplicate Warning - Shows at top for duplicate tickets */}
              {state.validationResult.isDuplicate && (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  gap: 10, 
                  marginBottom: 20,
                  padding: 14,
                  backgroundColor: '#FFF3CD',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#FFEAA7'
                }}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={22} color="#856404" />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#856404', flex: 1 }}>
                    This ticket has already been used
                  </Text>
                </View>
              )}
              
              {state.validationResult.customerName && (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  marginBottom: 16,
                  paddingLeft: 20
                }}>
                  <IconSymbol name="person.fill" size={18} color={colors.tint} />
                  <Text style={{ fontSize: 15, fontWeight: '500', color: colors.tabIconDefault, marginLeft: 8 }}>
                    Customer:
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, marginLeft: 12 }}>
                    {state.validationResult.customerName}
                  </Text>
                </View>
              )}
              
              {state.validationResult.seatFormatted && (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  marginBottom: 16,
                  paddingLeft: 20
                }}>
                  <Text style={{ fontSize: 18 }}>🪑</Text>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: colors.tabIconDefault, marginLeft: 8 }}>
                    Seat:
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, marginLeft: 12 }}>
                    {state.validationResult.seatFormatted}
                  </Text>
                </View>
              )}
              
              {/* Scan Time Information - Shows for all ticket types */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 12,
                paddingLeft: 20
              }}>
                <Text style={{ fontSize: 18 }}>🕐</Text>
                <Text style={{ fontSize: 15, fontWeight: '500', color: colors.tabIconDefault, marginLeft: 8 }}>
                  Scanned:
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, marginLeft: 12 }}>
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: false 
                  })}
                </Text>
              </View>
            </View>



            {/* Scan Next Button */}
            <TouchableOpacity
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center', 
                paddingHorizontal: 24, 
                paddingVertical: 16, 
                borderRadius: 12, 
                gap: 8, 
                marginTop: 20, 
                backgroundColor: state.validationResult.valid ? '#4CAF50' : '#F44336' 
              }}
              onPress={resetScanner}
            >
              <IconSymbol name="qrcode.viewfinder" size={24} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                {state.validationResult.valid 
                  ? 'Scan Next Ticket' 
                  : state.validationResult.isDuplicate 
                    ? 'Scan Different Ticket' 
                    : 'Try Again'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Loading Overlay */}
      {state.validating && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ padding: 30, borderRadius: 16, alignItems: 'center', backgroundColor: colors.card }}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Text style={{ marginTop: 15, fontSize: 16, fontWeight: '500', color: colors.text }}>
              Validating ticket...
            </Text>
            <Text style={{ marginTop: 5, fontSize: 14, opacity: 0.7, color: colors.tabIconDefault }}>
              Please wait
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
