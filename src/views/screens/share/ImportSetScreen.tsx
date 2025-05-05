import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { colors } from '../../../utils/colors';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useShareStore } from '../../../viewmodels/shareStore';
import { useAuthStore } from '../../../viewmodels/authStore';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'ImportSet'>;

export default function ImportSetScreen({ navigation, route }: Props) {
  const { shareCode: initialShareCode } = route.params || {};
  const [shareCode, setShareCode] = useState(initialShareCode || '');
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const {
    sharedSet,
    sharedCards,
    getSharedSet,
    importSharedSet,
    isLoading,
    error: shareStoreError,
  } = useShareStore();

  useEffect(() => {
    if (initialShareCode) {
      handleLoadSet();
    }
  }, [initialShareCode]);

  useEffect(() => {
    if (shareStoreError) {
      setError(shareStoreError);
    }
  }, [shareStoreError]);

  const handleLoadSet = async () => {
    if (!shareCode.trim()) {
      setError('Please enter a share code');
      return;
    }

    setError(null);
    try {
      await getSharedSet(shareCode.trim());
    } catch (e) {
      setError('Failed to load set. Please check the share code and try again.');
    }
  };

  const handleImport = async () => {
    if (!user) {
      Alert.alert('Error', 'You need to be logged in to import a set');
      return;
    }

    try {
      const newSetId = await importSharedSet(user.id);
      if (newSetId) {
        Alert.alert(
          'Success',
          'Flashcard set imported successfully!',
          [
            {
              text: 'View Set',
              onPress: () => navigation.replace('SetDetails', { setId: newSetId }),
            },
          ]
        );
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to import the set');
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
          <Text style={styles.title}>Import Set</Text>
          <Text style={styles.subtitle}>
            Import a flashcard set shared by another user
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Share Code"
            placeholder="Enter the share code (e.g., FL-xxxx-xxxx)"
            value={shareCode}
            onChangeText={setShareCode}
            autoCapitalize="none"
          />

          <Button
            title="Load Set"
            onPress={handleLoadSet}
            isLoading={isLoading && !sharedSet}
            fullWidth
            style={styles.loadButton}
          />
        </View>

        {isLoading && !sharedSet ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : sharedSet ? (
          <View style={styles.setPreviewContainer}>
            <Text style={styles.previewTitle}>Set Preview</Text>
            
            <View style={styles.setInfo}>
              <Text style={styles.setTitle}>{sharedSet.title}</Text>
              <Text style={styles.setDescription}>{sharedSet.description}</Text>
              
              <View style={styles.setStats}>
                <Text style={styles.statText}>
                  {sharedCards.length} {sharedCards.length === 1 ? 'card' : 'cards'}
                </Text>
              </View>
            </View>

            <View style={styles.cardsPreview}>
              <Text style={styles.cardsPreviewTitle}>
                {sharedCards.length > 0 ? 'Cards Preview:' : 'No cards in this set'}
              </Text>
              
              {sharedCards.slice(0, 3).map((card, index) => (
                <View key={card.id} style={styles.cardPreview}>
                  <Text style={styles.cardNumber}>{index + 1}</Text>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardQuestion} numberOfLines={1}>
                      {card.question}
                    </Text>
                    <Text style={styles.cardAnswer} numberOfLines={1}>
                      {card.answer}
                    </Text>
                  </View>
                </View>
              ))}
              
              {sharedCards.length > 3 && (
                <Text style={styles.moreCards}>
                  +{sharedCards.length - 3} more cards
                </Text>
              )}
            </View>

            <Button
              title="Import This Set"
              onPress={handleImport}
              isLoading={isLoading}
              fullWidth
              style={styles.importButton}
            />
          </View>
        ) : null}

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Import</Text>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Enter the share code you received
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Tap "Load Set" to view the shared flashcard set
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Tap "Import This Set" to add it to your collection
            </Text>
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
    padding: 16,
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
    marginBottom: 24,
  },
  loadButton: {
    marginTop: 16,
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
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  setPreviewContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  setInfo: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  setTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  setDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  setStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  cardsPreview: {
    marginBottom: 16,
  },
  cardsPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  moreCards: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  importButton: {
    marginTop: 8,
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
}); 