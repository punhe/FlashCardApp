import { create } from 'zustand';
import { FlashcardSet, Flashcard } from '../models/types';
import { getFlashcards, getFlashcardSet, createFlashcardSet, createFlashcard } from '../services/supabase';

interface ShareState {
  shareCode: string | null;
  sharedSet: FlashcardSet | null;
  sharedCards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  generateShareCode: (setId: string) => string;
  getSharedSet: (shareCode: string) => Promise<void>;
  importSharedSet: (userId: string) => Promise<string | null>;
}

export const useShareStore = create<ShareState>((set, get) => ({
  shareCode: null,
  sharedSet: null,
  sharedCards: [],
  isLoading: false,
  error: null,

  generateShareCode: (setId: string) => {
    // A simple encoding mechanism (in a real app, use a more robust algorithm)
    const code = `FL-${setId}-${Date.now().toString(36)}`;
    set({ shareCode: code });
    return code;
  },

  getSharedSet: async (shareCode: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Extract setId from shareCode
      const setIdMatch = shareCode.match(/FL-(.*?)-/);
      if (!setIdMatch || !setIdMatch[1]) {
        throw new Error('Invalid share code');
      }
      
      const setId = setIdMatch[1];
      const [set, cards] = await Promise.all([
        getFlashcardSet(setId),
        getFlashcards(setId)
      ]);
      
      set({ 
        sharedSet: set,
        sharedCards: cards,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  importSharedSet: async (userId: string) => {
    try {
      const { sharedSet, sharedCards } = get();
      
      if (!sharedSet || sharedCards.length === 0) {
        throw new Error('No shared set to import');
      }
      
      set({ isLoading: true, error: null });
      
      // Create a new set for the current user
      const newSetData: Partial<FlashcardSet> = {
        title: `${sharedSet.title} (Imported)`,
        description: sharedSet.description,
        user_id: userId,
      };
      
      const newSet = await createFlashcardSet(newSetData);
      
      // Create all cards in the new set
      await Promise.all(
        sharedCards.map(card => {
          const newCardData: Partial<Flashcard> = {
            question: card.question,
            answer: card.answer,
            set_id: newSet.id,
            isRemembered: false,
          };
          return createFlashcard(newCardData);
        })
      );
      
      set({ isLoading: false });
      return newSet.id;
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
      return null;
    }
  },
})); 