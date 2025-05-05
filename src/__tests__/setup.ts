/// <reference types="jest" />
// Mock the expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({}));

// Mock zustand
jest.mock('zustand', () => {
  const actual = jest.requireActual('zustand');
  return {
    ...actual,
    // When creating a store with create, make it mutable and add a getState helper
    create: (createState: any) => {
      const store = actual.create(createState);
      const initialState = store.getState();
      
      // Add setState method to be used in tests
      (store as any).setState = (newState: any) => {
        const state = store.getState();
        Object.assign(state, typeof newState === 'function' ? newState(state) : newState);
      };
      
      return store;
    },
  };
});

// Mock the Supabase service
jest.mock('../services/supabase', () => ({
  getFlashcards: jest.fn(),
  getFlashcard: jest.fn(),
  createFlashcard: jest.fn(),
  updateFlashcard: jest.fn(),
  deleteFlashcard: jest.fn(),
  updateFlashcardStatus: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
  getFlashcardSets: jest.fn(),
  getFlashcardSet: jest.fn(),
  createFlashcardSet: jest.fn(),
  updateFlashcardSet: jest.fn(),
  deleteFlashcardSet: jest.fn(),
  shareFlashcardSet: jest.fn(),
}));

// Set up global objects for Supabase URL polyfill if needed
global.URL = URL;
global.URLSearchParams = URLSearchParams; 