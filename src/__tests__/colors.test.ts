/// <reference types="jest" />
import { colors } from '../utils/colors';

describe('Colors Utility', () => {
  test('should have a primary color defined', () => {
    expect(colors.primary).toBeDefined();
    expect(colors.primary).toBe('#4CAF50');
  });

  test('should have a complete color palette', () => {
    expect(colors).toEqual(
      expect.objectContaining({
        primary: expect.any(String),
        primaryDark: expect.any(String),
        primaryLight: expect.any(String),
        accent: expect.any(String),
        textPrimary: expect.any(String),
        textSecondary: expect.any(String),
        divider: expect.any(String),
        background: expect.any(String),
        white: expect.any(String),
        error: expect.any(String),
        success: expect.any(String),
        warning: expect.any(String),
        info: expect.any(String),
      })
    );
  });
}); 