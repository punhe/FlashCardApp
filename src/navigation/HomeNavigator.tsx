import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import HomeScreen from '../views/screens/home/HomeScreen';
import CreateSetScreen from '../views/screens/sets/CreateSetScreen';
import SetDetailsScreen from '../views/screens/sets/SetDetailsScreen';
import EditSetScreen from '../views/screens/sets/EditSetScreen';
import CreateCardScreen from '../views/screens/cards/CreateCardScreen';
import EditCardScreen from '../views/screens/cards/EditCardScreen';
import StudyModeScreen from '../views/screens/study/StudyModeScreen';
import StatsScreen from '../views/screens/stats/StatsScreen';
import ShareScreen from '../views/screens/share/ShareScreen';
import ImportSetScreen from '../views/screens/share/ImportSetScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'FlashLearn' }}
      />
      <Stack.Screen 
        name="CreateSet" 
        component={CreateSetScreen} 
        options={{ title: 'Create Set' }}
      />
      <Stack.Screen 
        name="SetDetails" 
        component={SetDetailsScreen} 
        options={{ title: 'Set Details' }}
      />
      <Stack.Screen 
        name="EditSet" 
        component={EditSetScreen} 
        options={{ title: 'Edit Set' }}
      />
      <Stack.Screen 
        name="CreateCard" 
        component={CreateCardScreen} 
        options={{ title: 'Add Flashcard' }}
      />
      <Stack.Screen 
        name="EditCard" 
        component={EditCardScreen} 
        options={{ title: 'Edit Flashcard' }}
      />
      <Stack.Screen 
        name="StudyMode" 
        component={StudyModeScreen} 
        options={{ title: 'Study Mode', headerShown: false }}
      />
      <Stack.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ title: 'Statistics' }}
      />
      <Stack.Screen 
        name="Share" 
        component={ShareScreen} 
        options={{ title: 'Share Set' }}
      />
      <Stack.Screen 
        name="ImportSet" 
        component={ImportSetScreen} 
        options={{ title: 'Import Set' }}
      />
    </Stack.Navigator>
  );
} 