/// <reference types="jest" />
import { User, FlashcardSet, Flashcard, SetStats } from '../models/types';

describe('Data Types', () => {
  test('User type should be correctly structured', () => {
    const user: User = {
      id: '123',
      email: 'test@example.com',
      created_at: '2023-01-01',
    };
    
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('created_at');
  });
  
  test('FlashcardSet type should be correctly structured', () => {
    const set: FlashcardSet = {
      id: '123',
      title: 'Test Set',
      description: 'Test Description',
      user_id: '456',
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
    };
    
    expect(set).toHaveProperty('id');
    expect(set).toHaveProperty('title');
    expect(set).toHaveProperty('description');
    expect(set).toHaveProperty('user_id');
    expect(set).toHaveProperty('created_at');
    expect(set).toHaveProperty('updated_at');
  });
  
  test('Flashcard type should be correctly structured', () => {
    const card: Flashcard = {
      id: '123',
      question: 'Test Question',
      answer: 'Test Answer',
      set_id: '456',
      isRemembered: false,
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
    };
    
    expect(card).toHaveProperty('id');
    expect(card).toHaveProperty('question');
    expect(card).toHaveProperty('answer');
    expect(card).toHaveProperty('set_id');
    expect(card).toHaveProperty('isRemembered');
    expect(card).toHaveProperty('created_at');
    expect(card).toHaveProperty('updated_at');
  });
  
  test('SetStats type should be correctly structured', () => {
    const stats: SetStats = {
      total: 10,
      remembered: 5,
      notRemembered: 5,
    };
    
    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('remembered');
    expect(stats).toHaveProperty('notRemembered');
    expect(stats.total).toBe(stats.remembered + stats.notRemembered);
  });
}); 