# FlashLearn - Flashcard Study App

FlashLearn is a React Native mobile application built with Expo that helps users create and study flashcards. It features a clean, modern UI and powerful features for effective learning.

## Features

- Create and manage flashcard sets with multiple cards
- Study mode with card flip animation
- Mark cards as remembered or not yet remembered
- Track study progress with statistics
- Share flashcard sets with others
- Import shared flashcard sets
- User authentication

## Data Synchronization

FlashLearn uses a manual refresh approach rather than real-time updates via websockets. Users can pull-to-refresh on list screens or use the refresh button on detail screens to get the latest data from the server.

### Why Manual Refresh?

- More predictable data loading behavior
- Reduced battery consumption
- Less network traffic
- Better control over when data is refreshed
- Enhanced offline capabilities

### Where to Find Refresh Controls

- **Home Screen**: Pull down on the list of flashcard sets to refresh
- **Set Details Screen**: Pull down on the list of cards to refresh
- **Study Mode**: Use the refresh button in the header
- **Statistics Screen**: Pull down to refresh statistics

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - React Native toolchain and platform
- **TypeScript** - Static typing
- **Supabase** - Backend as a Service (BaaS) for database and authentication
- **Zustand** - State management
- **React Navigation** - Navigation library
- **React Native Reanimated** - Animation library
- **MVVM Architecture** - Model-View-ViewModel pattern for code organization

## Project Structure

The project follows the MVVM (Model-View-ViewModel) architecture:

- `models/` - Data structures and types
- `views/` - UI components and screens
  - `components/` - Reusable UI components
  - `screens/` - App screens
- `viewmodels/` - Business logic and state management
- `services/` - API calls and external services
- `navigation/` - Navigation configuration
- `utils/` - Utility functions and constants
- `hooks/` - Custom React hooks
- `assets/` - Static assets

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flash-learn.git
   cd flash-learn
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Supabase:
   - Create a new Supabase project
   - Set up the database tables (SQL schema provided below)
   - Update the Supabase URL and anon key in `src/services/supabase.ts`

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Supabase Schema

```sql
-- Create tables
CREATE TABLE flashcard_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  set_id UUID NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  is_remembered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own flashcard sets" ON flashcard_sets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD flashcards in their sets" ON flashcards
  FOR ALL USING (
    set_id IN (
      SELECT id FROM flashcard_sets WHERE user_id = auth.uid()
    )
  );
```

## Building for Production

To build the app for production:

```bash
expo build:android
# or
expo build:ios
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 