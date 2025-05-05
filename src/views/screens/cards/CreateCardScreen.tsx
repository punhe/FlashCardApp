import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { colors } from '../../../utils/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useFlashcardStore } from '../../../viewmodels/flashcardStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'CreateCard'>;

export default function CreateCardScreen({ navigation, route }: Props) {
  const { setId } = route.params;
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errors, setErrors] = useState<{
    question?: string;
    answer?: string;
  }>({});

  const { createCard, isLoading, error } = useFlashcardStore();

  const validateInputs = () => {
    const newErrors: {
      question?: string;
      answer?: string;
    } = {};
    let isValid = true;

    if (!question.trim()) {
      newErrors.question = 'Question is required';
      isValid = false;
    }

    if (!answer.trim()) {
      newErrors.answer = 'Answer is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateCard = async () => {
    if (validateInputs()) {
      try {
        await createCard({
          question: question.trim(),
          answer: answer.trim(),
          set_id: setId,
          isRemembered: false,
        });
        
        // Ask if the user wants to add another card or return to the set details
        Alert.alert(
          'Card Added',
          'Do you want to add another card?',
          [
            {
              text: 'Add Another',
              onPress: () => {
                setQuestion('');
                setAnswer('');
                setErrors({});
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } catch (err) {
        Alert.alert('Error', 'Failed to create flashcard');
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
          <Text style={styles.title}>Add New Card</Text>
          <Text style={styles.subtitle}>Create a new flashcard for your set</Text>
        </View>

        {!!error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Question"
            placeholder="Enter the question or front side of the card"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.textInput}
            value={question}
            onChangeText={setQuestion}
            error={errors.question}
          />
          
          <Input
            label="Answer"
            placeholder="Enter the answer or back side of the card"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.textInput}
            value={answer}
            onChangeText={setAnswer}
            error={errors.answer}
          />

          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewFront}>
                <Text style={styles.previewTitle}>Front</Text>
                <Text style={styles.previewText}>
                  {question || 'Question will appear here'}
                </Text>
              </View>
              <View style={styles.previewBack}>
                <Text style={styles.previewTitle}>Back</Text>
                <Text style={styles.previewText}>
                  {answer || 'Answer will appear here'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              type="secondary"
              style={styles.cancelButton}
            />
            
            <Button
              title="Add Card"
              onPress={handleCreateCard}
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
  textInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  previewSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  previewCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  previewFront: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: colors.divider,
  },
  previewBack: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primaryLight + '40',
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  previewText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
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