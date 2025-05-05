export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  set_id: string;
  isRemembered: boolean;
  created_at: string;
  updated_at: string;
}

export interface SetStats {
  total: number;
  remembered: number;
  notRemembered: number;
} 