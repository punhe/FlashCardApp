# Flash-Learn Test Documentation

This directory contains tests for the Flash-Learn application.

## Testing Architecture

The tests are organized as follows:

- Unit tests for utilities and models
- State management tests (Zustand stores)
- Component tests using React Testing Library

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Each test file follows the naming convention `*.test.ts` or `*.test.tsx` and is located in the `__tests__` directory.

## Mocking

The tests use Jest mocks for external dependencies. The setup file `setup.ts` contains global mocks for libraries like:

- react-native-reanimated
- expo-status-bar
- zustand
- react-native-gesture-handler

## Writing New Tests

When writing new tests, follow these guidelines:

1. Create a new test file in the `__tests__` directory
2. Import the component or module to be tested
3. Mock any external dependencies
4. Use descriptive test names that explain what is being tested
5. Keep tests isolated and focused on a single functionality
6. Use the React Testing Library API for component tests

## Example Test Structure

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Some text')).toBeTruthy();
  });

  test('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPress} />);
    fireEvent.press(getByText('Press me'));
    expect(onPress).toHaveBeenCalled();
  });
});
``` 