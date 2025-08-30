# PiScan

A robust and maintainable React Native application for QR code ticket validation with comprehensive error handling, type safety, and modular architecture.

## 🚀 Features

- **QR Code Scanning**: Real-time ticket validation using device camera
- **Statistics Dashboard**: Comprehensive validation statistics and analytics
- **Ticket History**: Complete validation history with filtering
- **Settings Management**: App configuration and backend connectivity
- **Error Handling**: Centralized error management with user-friendly messages
- **Type Safety**: Full TypeScript implementation with strict typing
- **Modular Architecture**: Clean separation of concerns with custom hooks
- **Network Resilience**: Robust API communication with retry logic
- **Development Tools**: Built-in testing utilities and debugging features

## 🏗️ Architecture

### Core Structure
```
src/
├── types/           # TypeScript interfaces and type definitions
├── hooks/           # Custom React hooks for business logic
├── utils/           # Utility functions and helpers
├── config/          # Configuration and API setup
└── components/      # Reusable UI components
```

### Key Design Patterns

1. **Custom Hooks Pattern**: Business logic separated into reusable hooks
   - `useScanner()` - Camera and validation logic
   - `useTickets()` - Ticket history and statistics management

2. **Error Handling Pattern**: Centralized error management
   - `ErrorHandler` singleton class
   - Consistent error codes and messages
   - Graceful fallbacks for network issues

3. **Type Safety Pattern**: Comprehensive TypeScript implementation
   - Strict interfaces for all data structures
   - API response type definitions
   - Component prop type safety

4. **Validation Pattern**: Input sanitization and validation
   - QR code format validation
   - Data sanitization utilities
   - Required field validation

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Camera**: expo-camera for QR code scanning
- **UI Components**: Custom themed components
- **State Management**: React Hooks with custom implementations
- **Network**: Fetch API with custom wrapper
- **Package Manager**: pnpm

## 📱 Screens

### Scanner Screen (`app/(tabs)/index.tsx`)
- Primary QR code scanning interface
- Real-time validation with visual feedback
- Manual ticket entry option
- Flash control and camera settings
- Development testing utilities

### Tickets Screen (`app/(tabs)/tickets.tsx`)
- Statistics dashboard with key metrics
- Ticket validation history with filtering
- Quick action buttons for common tasks
- Pull-to-refresh functionality

### Settings Screen (`app/(tabs)/settings.tsx`)
- Backend connection configuration
- Scanner settings and preferences
- Data management options
- App information and version details

## 🔧 Configuration

### Backend Setup
The app connects to a Node.js Express backend for ticket validation:

```typescript
// src/config/backend.ts
export const BACKEND_CONFIG = {
  BASE_URL: 'http://localhost:3002',
  REQUEST_TIMEOUT: 10000,
  RETRY_CONFIG: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },
};
```

### Environment Variables
Create a `.env` file for environment-specific configuration:

```env
BACKEND_URL=http://localhost:3002
API_TIMEOUT=10000
MAX_RETRIES=3
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   pnpm ios
   
   # Android
   pnpm android
   ```

## 🧪 Development

### Code Quality Standards

1. **TypeScript**: All code must be fully typed
2. **Error Handling**: All async operations must have error handling
3. **Validation**: Input validation for all user data
4. **Documentation**: JSDoc comments for complex functions
5. **Testing**: Unit tests for utility functions and hooks

### Custom Hooks Usage

#### Scanner Hook
```typescript
const {
  permission,
  state,
  cameraRef,
  handleBarCodeScanned,
  resetScanner,
  toggleFlash,
  handleManualEntry,
} = useScanner();
```

#### Tickets Hook
```typescript
const {
  tickets,
  stats,
  loading,
  refreshing,
  filter,
  filteredTickets,
  setFilter,
  onRefresh,
  formatTimeAgo,
} = useTickets();
```

### Error Handling

The app uses a centralized error handling system:

```typescript
import { errorHandler, ERROR_CODES } from '@/src/utils/errorHandler';

// Handle specific errors
errorHandler.registerHandler(ERROR_CODES.NETWORK_ERROR, (error) => {
  // Custom network error handling
});

// Create and handle errors
const error = errorHandler.createError(
  ERROR_CODES.VALIDATION_ERROR,
  'Invalid QR code format'
);
errorHandler.handleError(error);
```

### Validation Utilities

```typescript
import { ValidationUtils } from '@/src/utils/validation';

// Validate QR code format
const isValid = ValidationUtils.isValidQRCode(qrData);

// Sanitize API response
const cleanResult = ValidationUtils.sanitizeValidationResult(rawData);

// Format time ago
const timeAgo = ValidationUtils.formatTimeAgo(timestamp);
```

## 🔍 Testing

### Development Testing
The app includes built-in testing utilities:

- **Network Testing**: Test backend connectivity
- **QR Code Testing**: Mock valid/invalid ticket responses
- **Error Simulation**: Test error handling scenarios

### Manual Testing
1. **Scanner Testing**: Use test QR codes in development mode
2. **Network Testing**: Test with backend connectivity
3. **Error Scenarios**: Test offline mode and invalid inputs

## 📊 Performance

### Optimization Strategies

1. **Memoization**: React.memo for expensive components
2. **Lazy Loading**: Code splitting for large components
3. **Image Optimization**: Optimized assets and caching
4. **Network Optimization**: Request caching and retry logic

### Monitoring

- Network request performance
- Camera initialization time
- Memory usage patterns
- Error rate tracking

## 🔒 Security

### Data Protection

1. **Input Validation**: All user inputs are validated and sanitized
2. **Network Security**: HTTPS for all API communications
3. **Error Handling**: No sensitive data in error messages
4. **Permission Management**: Minimal required permissions

### Best Practices

- Validate all QR code data before processing
- Sanitize API responses before display
- Handle network errors gracefully
- Log errors without exposing sensitive information

## 🚀 Deployment

### Production Build

1. **Configure production backend URL**
2. **Update environment variables**
3. **Build for production**
   ```bash
   pnpm build:ios
   pnpm build:android
   ```

### App Store Deployment

1. **Configure app signing**
2. **Update app metadata**
3. **Submit to App Store/Play Store**

## 🤝 Contributing

### Development Workflow

1. **Feature Branch**: Create feature branch from main
2. **Type Safety**: Ensure all code is properly typed
3. **Error Handling**: Add appropriate error handling
4. **Testing**: Test on both iOS and Android
5. **Documentation**: Update documentation as needed

### Code Review Checklist

- [ ] TypeScript types are complete and accurate
- [ ] Error handling is implemented
- [ ] Input validation is present
- [ ] Performance considerations addressed
- [ ] Documentation is updated
- [ ] Tests pass on both platforms

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review error logs
- Test with development utilities
- Contact the development team

---

**Built with ❤️ using React Native and TypeScript**
