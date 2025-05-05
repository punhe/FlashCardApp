import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { colors } from '../../../utils/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useFlashcardSetStore } from '../../../viewmodels/flashcardSetStore';
import { useAuthStore } from '../../../viewmodels/authStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'CreateSet'>;

export default function CreateSetScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  
  const { createSet, isLoading, error } = useFlashcardSetStore();
  const { user } = useAuthStore();

  const validateInputs = () => {
    const newErrors: {
      title?: string;
      description?: string;
    } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateSet = async () => {
    if (!user) {
      Alert.alert('Error', 'You need to be logged in to create a set');
      return;
    }

    if (validateInputs()) {
      try {
        const newSet = await createSet({
          title: title.trim(),
          description: description.trim(),
          user_id: user.id,
        });
        
        if (newSet.id.includes('local')) {
          // Show a message that we're in offline mode but continue
          Alert.alert(
            'Offline Mode',
            'Your set has been created in offline mode. It will sync when you reconnect to the internet.',
            [{ text: 'Continue', onPress: () => navigation.replace('SetDetails', { setId: newSet.id }) }]
          );
        } else {
          // Navigate directly if online
          navigation.replace('SetDetails', { setId: newSet.id });
        }
      } catch (err) {
        Alert.alert(
          'Error',
          'Failed to create flashcard set. Please check your network connection and try again.'
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create New Set</Text>
          <Text style={styles.subtitle}>Add information about your flashcard set</Text>
        </View>

        {!!error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Title"
            placeholder="e.g. Spanish Vocabulary"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          
          <Input
            label="Description"
            placeholder="Brief description of this set"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            error={errors.description}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              type="secondary"
              style={styles.cancelButton}
            />
            
            <Button
              title="Create Set"
              onPress={handleCreateSet}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  descriptionInput: {
    height: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  errorContainer: {
    backgroundColor: colors.error + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
  },
}); 