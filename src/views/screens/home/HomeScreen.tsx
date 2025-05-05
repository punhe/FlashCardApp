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
import { FlashcardSetCard } from '../../components/FlashcardSetCard';
import { useFlashcardSetStore } from '../../../viewmodels/flashcardSetStore';
import { useAuthStore } from '../../../viewmodels/authStore';
import { getFlashcards } from '../../../services/supabase';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const { sets, fetchSets, deleteSet, isLoading, error } = useFlashcardSetStore();
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSets(user.id);
    }
  }, [user, fetchSets]);

  const loadCardCounts = async () => {
    try {
      setIsLoadingCounts(true);
      const countPromises = sets.map(async (set) => {
        const cards = await getFlashcards(set.id);
        return { setId: set.id, count: cards.length };
      });
      
      const results = await Promise.all(countPromises);
      const counts: Record<string, number> = {};
      
      results.forEach(({ setId, count }) => {
        counts[setId] = count;
      });
      
      setCardCounts(counts);
    } catch (error) {
      console.error('Error loading card counts:', error);
    } finally {
      setIsLoadingCounts(false);
    }
  };

  useEffect(() => {
    if (sets.length > 0) {
      loadCardCounts();
    }
  }, [sets]);

  const onRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      await fetchSets(user.id);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteSet = (id: string, title: string) => {
    Alert.alert(
      'Delete Set',
      `Are you sure you want to delete "${title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteSet(id),
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="book" size={64} color={colors.primaryLight} />
      <Text style={styles.emptyTitle}>No flashcard sets yet</Text>
      <Text style={styles.emptyText}>
        Create your first set of flashcards to start studying
      </Text>
    </View>
  );

  if (isLoading && !isLoadingCounts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Flashcards</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateSet')}
        >
          <FontAwesome name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <FlashcardSetCard
            set={item}
            cardCount={cardCounts[item.id] || 0}
            onPress={() => navigation.navigate('SetDetails', { setId: item.id })}
            onStudyPress={() => 
              navigation.navigate('StudyMode', { setId: item.id })
            }
            onEditPress={() => 
              navigation.navigate('EditSet', { setId: item.id })
            }
            onDeletePress={() => handleDeleteSet(item.id, item.title)}
            onStatsPress={() => 
              navigation.navigate('Stats', { setId: item.id })
            }
            onSharePress={() => 
              navigation.navigate('Share', { setId: item.id })
            }
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          sets.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmptyState}
      />
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
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    backgroundColor: colors.error + '20',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
  },
}); 