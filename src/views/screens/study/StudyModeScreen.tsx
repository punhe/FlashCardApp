import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { colors } from '../../../utils/colors';
import { FlashcardCard } from '../../components/FlashcardCard';
import { useFlashcardStore } from '../../../viewmodels/flashcardStore';
import { useFlashcardSetStore } from '../../../viewmodels/flashcardSetStore';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'StudyMode'>;

export default function StudyModeScreen({ navigation, route }: Props) {
  const { setId } = route.params;
  
  const { currentSet, fetchSet } = useFlashcardSetStore();
  const { 
    cards, 
    currentCard, 
    currentIndex, 
    fetchCards, 
    updateCardStatus, 
    goToNextCard, 
    goToPreviousCard, 
    resetStudySession,
    isLoading, 
    error,
    stats,
  } = useFlashcardStore();
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    await fetchSet(setId);
    await fetchCards(setId);
  };
  
  useEffect(() => {
    loadData();
    
    return () => {
      resetStudySession();
    };
  }, [fetchSet, fetchCards, setId, resetStudySession]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
      resetStudySession();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRememberedPress = async (id: string, remembered: boolean) => {
    await updateCardStatus(id, remembered);
    // Go to next card automatically after marking
    if (currentIndex < cards.length - 1) {
      goToNextCard();
    } else {
      // Show completion dialog if we're at the last card
      Alert.alert(
        'Session Complete',
        `You've completed all cards in this set!\n\nRemembered: ${stats?.remembered || 0}/${stats?.total || 0}`,
        [
          { 
            text: 'View Stats', 
            onPress: () => navigation.replace('Stats', { setId }),
          },
          { 
            text: 'Start Again', 
            onPress: () => resetStudySession(),
          },
          { 
            text: 'Exit', 
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
        ]
      );
    }
  };

  if (isLoading || !currentCard) {
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
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchCards(setId)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="exclamation-circle" size={64} color={colors.primaryLight} />
        <Text style={styles.emptyTitle}>No flashcards found</Text>
        <Text style={styles.emptyText}>
          This set doesn't have any flashcards yet. Add some cards to start studying.
        </Text>
        <TouchableOpacity 
          style={styles.addCardButton}
          onPress={() => navigation.replace('CreateCard', { setId })}
        >
          <Text style={styles.addCardText}>Add Flashcard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={1}>
          {currentSet?.title}
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing || isLoading}
          >
            <FontAwesome 
              name="refresh" 
              size={20} 
              color={colors.white} 
            />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {cards.length}
            </Text>
          </View>
        </View>
      </View>

      {refreshing ? (
        <View style={styles.refreshingIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : null}

      <View style={styles.cardContainer}>
        <FlashcardCard 
          card={currentCard}
          onRememberedPress={handleRememberedPress}
        />
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[
            styles.navButton, 
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={goToPreviousCard}
          disabled={currentIndex === 0}
        >
          <FontAwesome 
            name="chevron-left" 
            size={24} 
            color={currentIndex === 0 ? colors.divider : colors.primary} 
          />
        </TouchableOpacity>
        
        <View style={styles.cardIndicatorContainer}>
          {cards.map((_, index) => (
            <View 
              key={index}
              style={[
                styles.cardIndicator,
                index === currentIndex ? styles.cardIndicatorActive : null,
                cards[index].isRemembered ? styles.cardIndicatorRemembered : null,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.navButton,
            currentIndex === cards.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={goToNextCard}
          disabled={currentIndex === cards.length - 1}
        >
          <FontAwesome 
            name="chevron-right" 
            size={24} 
            color={currentIndex === cards.length - 1 ? colors.divider : colors.primary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 48, // Extra padding for status bar
  },
  closeButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  refreshingIndicator: {
    height: 2,
    backgroundColor: colors.primaryLight,
    width: '100%',
  },
  progressContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  progressText: {
    color: colors.primary,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  navButtonDisabled: {
    backgroundColor: colors.background,
    shadowOpacity: 0,
    elevation: 0,
  },
  cardIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '60%',
  },
  cardIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
    margin: 4,
  },
  cardIndicatorActive: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardIndicatorRemembered: {
    backgroundColor: colors.success,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addCardButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  addCardText: {
    color: colors.white,
    fontWeight: '600',
  },
}); 