import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { colors } from '../../../utils/colors';
import { Button } from '../../components/Button';
import { useShareStore } from '../../../viewmodels/shareStore';
import { useFlashcardSetStore } from '../../../viewmodels/flashcardSetStore';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Share'>;

export default function ShareScreen({ navigation, route }: Props) {
  const { setId } = route.params;
  const [copied, setCopied] = useState(false);

  const { currentSet, fetchSet } = useFlashcardSetStore();
  const { 
    shareCode, 
    generateShareCode, 
    isLoading,
    error,
  } = useShareStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchSet(setId);
      // Generate a share code for this set
      generateShareCode(setId);
    };
    
    loadData();
  }, [fetchSet, generateShareCode, setId]);

  const handleShare = async () => {
    if (!shareCode || !currentSet) return;

    try {
      await Share.share({
        message: `Check out my flashcard set "${currentSet.title}" on FlashLearn! Import it using this code: ${shareCode}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the set');
    }
  };

  const handleCopyCode = () => {
    // In a real app, you would use Clipboard.setString(shareCode)
    setCopied(true);
    Alert.alert('Success', 'Share code copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (isLoading || !currentSet) {
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
          onPress={() => {
            fetchSet(setId);
            generateShareCode(setId);
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Share Set</Text>
        <Text style={styles.subtitle}>
          Share your flashcard set "{currentSet.title}" with others
        </Text>
      </View>

      <View style={styles.shareInfoContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="share-alt" size={48} color={colors.primary} />
        </View>
        <Text style={styles.shareInfoText}>
          Others can import your flashcard set by using the share code below.
        </Text>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Share Code:</Text>
        <View style={styles.codeWrapper}>
          <Text style={styles.codeText}>{shareCode}</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={handleCopyCode}
          >
            <FontAwesome 
              name={copied ? "check" : "copy"} 
              size={20} 
              color={copied ? colors.success : colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Button
          title="Share"
          onPress={handleShare}
          icon={<FontAwesome name="share" size={18} color={colors.white} />}
          fullWidth
        />
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Share</Text>
        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>1</Text>
          </View>
          <Text style={styles.instructionText}>
            Copy the share code above
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>2</Text>
          </View>
          <Text style={styles.instructionText}>
            Send the code to the person you want to share with
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>3</Text>
          </View>
          <Text style={styles.instructionText}>
            They can import your set from the home screen
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
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
  shareInfoContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.white,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareInfoText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  codeContainer: {
    padding: 16,
    backgroundColor: colors.background,
    margin: 16,
    borderRadius: 8,
  },
  codeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  codeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  codeText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  copyButton: {
    padding: 8,
  },
  actionContainer: {
    padding: 16,
  },
  instructionsContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
}); 