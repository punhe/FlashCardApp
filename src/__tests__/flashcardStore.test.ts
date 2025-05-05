/// <reference types="jest" />
import { useFlashcardStore } from '../viewmodels/flashcardStore';
import * as supabaseService from '../services/supabase';

// Mock the supabase service
jest.mock('../services/supabase', () => ({
  getFlashcards: jest.fn(),
  getFlashcard: jest.fn(),
  createFlashcard: jest.fn(),
  updateFlashcard: jest.fn(),
  deleteFlashcard: jest.fn(),
  updateFlashcardStatus: jest.fn(),
}));

describe('Flashcard Store', () => {
  beforeEach(() => {
    // Clear the store and reset mocks before each test
    useFlashcardStore.setState({
      cards: [],
      currentCard: null,
      currentIndex: 0,
      stats: {
        total: 0,
        remembered: 0,
        notRemembered: 0,
      },
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const store = useFlashcardStore.getState();
    expect(store.cards).toEqual([]);
    expect(store.currentCard).toBeNull();
    expect(store.currentIndex).toBe(0);
    expect(store.stats).toEqual({
      total: 0,
      remembered: 0,
      notRemembered: 0,
    });
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  test('should fetch flashcards successfully', async () => {
    const mockCards = [
      {
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        set_id: 'set1',
        isRemembered: false,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
      {
        id: '2',
        question: 'Question 2',
        answer: 'Answer 2',
        set_id: 'set1',
        isRemembered: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    ];

    // Mock the getFlashcards function to return mockCards
    (supabaseService.getFlashcards as jest.Mock).mockResolvedValue(mockCards);

    // Call fetchCards
    await useFlashcardStore.getState().fetchCards('set1');

    // Verify the store state after fetching
    const store = useFlashcardStore.getState();
    expect(store.cards).toEqual(mockCards);
    expect(store.currentCard).toEqual(mockCards[0]);
    expect(store.currentIndex).toBe(0);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.stats).toEqual({
      total: 2,
      remembered: 1,
      notRemembered: 1,
    });
  });

  test('should handle navigation between cards', () => {
    const mockCards = [
      {
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        set_id: 'set1',
        isRemembered: false,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
      {
        id: '2',
        question: 'Question 2',
        answer: 'Answer 2',
        set_id: 'set1',
        isRemembered: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    ];

    // Set initial state
    useFlashcardStore.setState({
      cards: mockCards,
      currentCard: mockCards[0],
      currentIndex: 0,
      stats: {
        total: 2,
        remembered: 1,
        notRemembered: 1,
      },
      isLoading: false,
      error: null,
    });

    // Test goToNextCard
    useFlashcardStore.getState().goToNextCard();
    expect(useFlashcardStore.getState().currentIndex).toBe(1);
    expect(useFlashcardStore.getState().currentCard).toEqual(mockCards[1]);

    // Test goToPreviousCard
    useFlashcardStore.getState().goToPreviousCard();
    expect(useFlashcardStore.getState().currentIndex).toBe(0);
    expect(useFlashcardStore.getState().currentCard).toEqual(mockCards[0]);

    // Test wrap-around behavior for next
    useFlashcardStore.setState({ currentIndex: 1, currentCard: mockCards[1] });
    useFlashcardStore.getState().goToNextCard();
    expect(useFlashcardStore.getState().currentIndex).toBe(0);
    expect(useFlashcardStore.getState().currentCard).toEqual(mockCards[0]);

    // Test wrap-around behavior for previous
    useFlashcardStore.setState({ currentIndex: 0, currentCard: mockCards[0] });
    useFlashcardStore.getState().goToPreviousCard();
    expect(useFlashcardStore.getState().currentIndex).toBe(1);
    expect(useFlashcardStore.getState().currentCard).toEqual(mockCards[1]);
  });
}); 