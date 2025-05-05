import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { colors } from '../../../utils/colors';
import { FlashcardCard } from '../../components/FlashcardCard';
import { useFlashcardStore } from '../../../viewmodels/flashcardStore';
import { useFlashcardSetStore } from '../../../viewmodels/flashcardSetStore';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<HomeStackParamList, 'SetDetails'>;

export default function SetDetailsScreen({ navigation, route }: Props) {
  const { setId } = route.params;
  
  const { currentSet, fetchSet, deleteSet } = useFlashcardSetStore();
  const { 
    cards,
    fetchCards,
    deleteCard,
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
  }, [fetchSet, fetchCards, setId]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditSet = () => {
    navigation.navigate('EditSet', { setId });
  };

  const handleAddCard = () => {
    navigation.navigate('CreateCard', { setId });
  };

  const handleEditCard = (cardId: string) => {
    navigation.navigate('EditCard', { cardId, setId });
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteCard(cardId),
        },
      ]
    );
  };

  const handleDeleteSet = () => {
    Alert.alert(
      'Delete Set',
      `Are you sure you want to delete "${currentSet?.title}"? All cards in this set will be deleted. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteSet(setId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleStartStudy = () => {
    if (cards.length === 0) {
      Alert.alert(
        'No Flashcards',
        'You need to add at least one flashcard to start studying.',
        [
          { text: 'Add Card', onPress: handleAddCard },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    
    navigation.navigate('StudyMode', { setId });
  };

  const handleShareSet = () => {
    if (cards.length === 0) {
      Alert.alert(
        'No Flashcards',
        'You need to add at least one flashcard to share this set.',
        [
          { text: 'Add Card', onPress: handleAddCard },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    
    navigation.navigate('Share', { setId });
  };

  const handleViewStats = () => {
    if (cards.length === 0) {
      Alert.alert(
        'No Flashcards',
        'You need to add at least one flashcard to view statistics.',
        [
          { text: 'Add Card', onPress: handleAddCard },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    
    navigation.navigate('Stats', { setId });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="lightbulb-o" size={64} color={colors.primaryLight} />
      <Text style={styles.emptyTitle}>No Flashcards Yet</Text>
      <Text style={styles.emptyText}>
        Start adding flashcards to this set to begin studying.
      </Text>
      <Button
        title="Add Your First Card"
        onPress={handleAddCard}
        style={styles.addCardButton}
      />
    </View>
  );

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
            fetchCards(setId);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {currentSet.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={3}>
            {currentSet.description}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{cards.length}</Text>
              <Text style={styles.statLabel}>Cards</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.remembered || 0}</Text>
              <Text style={styles.statLabel}>Learned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.notRemembered || 0}</Text>
              <Text style={styles.statLabel}>To Learn</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleStartStudy}>
          <FontAwesome name="graduation-cap" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Study</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleAddCard}>
          <FontAwesome name="plus" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Add Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleEditSet}>
          <FontAwesome name="edit" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Edit Set</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShareSet}>
          <FontAwesome name="share-alt" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleViewStats}>
          <FontAwesome name="bar-chart" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={cards.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item, index }) => (
          <View style={styles.cardContainer}>
            <Text style={styles.cardNumber}>{index + 1}</Text>
            <View style={styles.cardWrapper}>
              <FlashcardCard
                card={item}
                showActions={false}
                isFlippable={true}
              />
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.cardActionButton}
                  onPress={() => handleEditCard(item.id)}
                >
                  <FontAwesome name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cardActionButton}
                  onPress={() => handleDeleteCard(item.id)}
                >
                  <FontAwesome name="trash" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteSet}
      >
        <FontAwesome name="trash" size={20} color={colors.error} />
        <Text style={styles.deleteText}>Delete Set</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    color: colors.primary,
  },
  divider: {
    height: 12,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    width: 30,
    textAlign: 'center',
  },
  cardWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cardActionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addCardButton: {
    paddingHorizontal: 24,
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
  deleteButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: colors.error,
    marginLeft: 8,
    fontWeight: '600',
  },
}); 