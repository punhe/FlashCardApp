/// <reference types="jest" />
import { render } from '@testing-library/react-native';
import App from '../../App';

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  useURL: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const SafeAreaContext = require('react-native').View;
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
  };
});

// Mock the native stack navigator
jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) => children,
      Screen: ({ children }: { children: React.ReactNode }) => children,
    }),
  };
});

// Mock bottom tabs navigator
jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) => children,
      Screen: ({ children }: { children: React.ReactNode }) => children,
    }),
  };
});

describe('App', () => {
  it('renders without crashing', () => {
    // This test just verifies that the App component can be rendered
    // without throwing an error
    expect(() => render(<App />)).not.toThrow();
  });
}); 