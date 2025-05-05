import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { colors } from '../../../utils/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useFlashcardSetStore } from '../../../viewmodels/flashcardSetStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'EditSet'>;

export default function EditSetScreen({ navigation, route }: Props) {
  const { setId } = route.params;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const { 
    currentSet, 
    fetchSet, 
    updateSet, 
    isLoading, 
    error 
  } = useFlashcardSetStore();

  useEffect(() => {
    const loadSet = async () => {
      await fetchSet(setId);
    };
    loadSet();
  }, [fetchSet, setId]);

  useEffect(() => {
    if (currentSet) {
      setTitle(currentSet.title);
      setDescription(currentSet.description);
    }
  }, [currentSet]);

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

  const handleUpdateSet = async () => {
    if (validateInputs()) {
      try {
        await updateSet(setId, {
          title: title.trim(),
          description: description.trim(),
        });
        
        navigation.goBack();
      } catch (err) {
        Alert.alert('Error', 'Failed to update flashcard set');
      }
    }
  };

  if (isLoading && !currentSet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={() => fetchSet(setId)}
        />
      </View>
    );
  }

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
          <Text style={styles.title}>Edit Set</Text>
          <Text style={styles.subtitle}>Update your flashcard set information</Text>
        </View>

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
              title="Save Changes"
              onPress={handleUpdateSet}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
}); 