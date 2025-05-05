import { create } from 'zustand';
import { Flashcard, SetStats } from '../models/types';
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcard,
  getFlashcards,
  updateFlashcard,
  updateFlashcardStatus,
} from '../services/supabase';

interface FlashcardState {
  cards: Flashcard[];
  currentCard: Flashcard | null;
  currentIndex: number;
  stats: SetStats;
  isLoading: boolean;
  error: string | null;
  fetchCards: (setId: string) => Promise<void>;
  fetchCard: (id: string) => Promise<void>;
  createCard: (card: Partial<Flashcard>) => Promise<void>;
  updateCard: (id: string, card: Partial<Flashcard>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  updateCardStatus: (id: string, isRemembered: boolean) => Promise<void>;
  goToNextCard: () => void;
  goToPreviousCard: () => void;
  resetStudySession: () => void;
  calculateStats: () => void;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
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

  fetchCards: async (setId: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await getFlashcards(setId);
      
      // Ensure data is an array even if API returns null or undefined
      const safeData = Array.isArray(data) ? data : [];
      
      set((state) => {
        const newState = { 
          cards: safeData, 
          isLoading: false,
          currentIndex: 0,
          currentCard: safeData.length > 0 ? safeData[0] : null,
        };
        return newState;
      });
      get().calculateStats();
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
      // Ensure stats are reset on error
      set((state) => ({
        stats: {
          total: 0,
          remembered: 0,
          notRemembered: 0,
        }
      }));
    }
  },

  fetchCard: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await getFlashcard(id);
      set({ 
        currentCard: data, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  createCard: async (cardData: Partial<Flashcard>) => {
    try {
      set({ isLoading: true, error: null });
      const newCard = await createFlashcard(cardData);
      if (!newCard || !newCard.id) {
        throw new Error('Failed to create card');
      }
      
      set((state) => ({ 
        cards: [...state.cards, newCard], 
        isLoading: false,
        currentCard: newCard
      }));
      get().calculateStats();
    } catch (error) {
      console.warn('Error creating card:', error);
      
      // Create a mock card for offline usage
      const mockCard: Flashcard = {
        ...cardData as any,
        id: `card-local-${Date.now()}`,
        isRemembered: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      set((state) => ({
        cards: [...state.cards, mockCard],
        currentCard: mockCard,
        error: 'Network error: Using offline mode',
        isLoading: false
      }));
      
      get().calculateStats();
    }
  },

  updateCard: async (id: string, cardData: Partial<Flashcard>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedCard = await updateFlashcard(id, cardData);
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? updatedCard : c)),
        currentCard: state.currentCard?.id === id ? updatedCard : state.currentCard,
        isLoading: false,
      }));
      get().calculateStats();
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  deleteCard: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteFlashcard(id);
      set((state) => {
        const filteredCards = state.cards.filter((c) => c.id !== id);
        const newIndex = Math.min(state.currentIndex, filteredCards.length - 1);
        return {
          cards: filteredCards,
          currentIndex: newIndex >= 0 ? newIndex : 0,
          currentCard: newIndex >= 0 ? filteredCards[newIndex] : null,
          isLoading: false,
        };
      });
      get().calculateStats();
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  updateCardStatus: async (id: string, isRemembered: boolean) => {
    try {
      set({ isLoading: true, error: null });
      const updatedCard = await updateFlashcardStatus(id, isRemembered);
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? updatedCard : c)),
        currentCard: state.currentCard?.id === id ? updatedCard : state.currentCard,
        isLoading: false,
      }));
      get().calculateStats();
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  goToNextCard: () => {
    set((state) => {
      if (!state.cards || state.cards.length === 0) {
        return { currentIndex: 0, currentCard: null };
      }
      const nextIndex = (state.currentIndex + 1) % state.cards.length;
      return {
        currentIndex: nextIndex,
        currentCard: state.cards[nextIndex] || null,
      };
    });
  },

  goToPreviousCard: () => {
    set((state) => {
      if (!state.cards || state.cards.length === 0) {
        return { currentIndex: 0, currentCard: null };
      }
      const prevIndex = (state.currentIndex - 1 + state.cards.length) % state.cards.length;
      return {
        currentIndex: prevIndex,
        currentCard: state.cards[prevIndex] || null,
      };
    });
  },

  resetStudySession: () => {
    set((state) => ({
      currentIndex: 0,
      currentCard: state.cards.length > 0 ? state.cards[0] : null,
    }));
  },

  calculateStats: () => {
    set((state) => {
      if (!state.cards || state.cards.length === 0) {
        return {
          stats: {
            total: 0,
            remembered: 0,
            notRemembered: 0,
          }
        };
      }
      
      const total = state.cards.length;
      const remembered = state.cards.filter((card) => card.isRemembered).length;
      return {
        stats: {
          total,
          remembered,
          notRemembered: total - remembered,
        },
      };
    });
  },
})); 