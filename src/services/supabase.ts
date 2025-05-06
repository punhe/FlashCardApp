import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { FlashcardSet, Flashcard } from '../models/types';

// Replace with your Supabase URL and anon key
const supabaseUrl = '';
const supabaseKey = '';

// Mock data for offline/error scenarios
const MOCK_SETS: FlashcardSet[] = [
  {
    id: 'set-1',
    title: 'Sample Study Set',
    description: 'This is a sample study set created for demonstration',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'set-2',
    title: 'Language Learning',
    description: 'Basic vocabulary for language learning',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const MOCK_CARDS: Flashcard[] = [
  {
    id: 'card-1',
    question: 'What is React Native?',
    answer: 'A framework for building native apps using React',
    set_id: 'set-1',
    isRemembered: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'card-2',
    question: 'What is JSX?',
    answer: 'A syntax extension for JavaScript that looks similar to HTML',
    set_id: 'set-1',
    isRemembered: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'card-3',
    question: 'Hello',
    answer: 'Xin chào',
    set_id: 'set-2',
    isRemembered: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Function to safely make Supabase calls and fall back to mock data
async function safeSupabaseCall<T>(apiCall: () => Promise<T>, mockData: T): Promise<T> {
  try {
    // Set a timeout to prevent hanging requests
    const timeoutPromise = new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 5000); // 5 second timeout
    });
    
    // Try the API call with a timeout
    return await Promise.race([
      apiCall(),
      timeoutPromise
    ]);
  } catch (error) {
    // Log the error but return mock data instead of throwing
    console.warn('Network request failed, using mock data', error);
    return mockData;
  }
}

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: {
      'X-Disable-Realtime': 'true'
    }
  },
});

// Flashcard Sets
export const getFlashcardSets = async (userId: string) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcard_sets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as FlashcardSet[];
  }, MOCK_SETS.filter(set => set.user_id === userId));
};

export const getFlashcardSet = async (id: string) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcard_sets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as FlashcardSet;
  }, MOCK_SETS.find(set => set.id === id) || MOCK_SETS[0]);
};

export const createFlashcardSet = async (set: Partial<FlashcardSet>) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcard_sets')
      .insert(set)
      .select()
      .single();
    
    if (error) throw error;
    return data as FlashcardSet;
  }, {
    ...set,
    id: `set-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as FlashcardSet);
};

export const updateFlashcardSet = async (id: string, set: Partial<FlashcardSet>) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcard_sets')
      .update(set)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as FlashcardSet;
  }, {
    ...(MOCK_SETS.find(s => s.id === id) || MOCK_SETS[0]),
    ...set,
    updated_at: new Date().toISOString()
  } as FlashcardSet);
};

export const deleteFlashcardSet = async (id: string) => {
  return safeSupabaseCall(async () => {
    const { error } = await supabase
      .from('flashcard_sets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }, true);
};

// Flashcards
export const getFlashcards = async (setId: string) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('set_id', setId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as Flashcard[];
  }, MOCK_CARDS.filter(card => card.set_id === setId));
};

export const getFlashcard = async (id: string) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Flashcard;
  }, MOCK_CARDS.find(card => card.id === id) || MOCK_CARDS[0]);
};

export const createFlashcard = async (card: Partial<Flashcard>) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(card)
      .select()
      .single();
    
    if (error) throw error;
    return data as Flashcard;
  }, {
    ...card,
    id: `card-${Date.now()}`,
    isRemembered: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Flashcard);
};

export const updateFlashcard = async (id: string, card: Partial<Flashcard>) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcards')
      .update(card)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Flashcard;
  }, {
    ...(MOCK_CARDS.find(c => c.id === id) || MOCK_CARDS[0]),
    ...card,
    updated_at: new Date().toISOString()
  } as Flashcard);
};

export const deleteFlashcard = async (id: string) => {
  return safeSupabaseCall(async () => {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }, true);
};

export const updateFlashcardStatus = async (id: string, isRemembered: boolean) => {
  return safeSupabaseCall(async () => {
    const { data, error } = await supabase
      .from('flashcards')
      .update({ isRemembered })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Flashcard;
  }, {
    ...(MOCK_CARDS.find(c => c.id === id) || MOCK_CARDS[0]),
    isRemembered,
    updated_at: new Date().toISOString()
  } as Flashcard);
};

// Simplified Auth functions - not actually doing auth anymore
export const signIn = async (email: string, password: string) => {
  return { user: { id: 'user-1', email, created_at: new Date().toISOString() } };
};

export const signUp = async (email: string, password: string) => {
  return { user: { id: 'user-1', email, created_at: new Date().toISOString() } };
};

export const signOut = async () => {
  return true;
};

export const getCurrentUser = async () => {
  return { id: 'user-1', email: 'user@example.com', created_at: new Date().toISOString() };
}; 
