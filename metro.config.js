const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path alias resolution
config.resolver.alias = {
  '@': path.resolve(__dirname),
};

// Ensure proper module resolution for React Native 0.79.5
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add resolver configuration for better compatibility
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
