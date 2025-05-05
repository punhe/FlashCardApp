import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { colors } from '../../../utils/colors';
import { Button } from '../../components/Button';
import { useFlashcardStore } from '../../../viewmodels/flashcardStore';
import { useFlashcardSetStore } from '../../../viewmodels/flashcardSetStore';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackParamList, 'Stats'>;

export default function StatsScreen({ navigation, route }: Props) {
  const { setId } = route.params;
  
  const { currentSet, fetchSet } = useFlashcardSetStore();
  const { 
    cards, 
    fetchCards, 
    stats,
    isLoading, 
    error,
  } = useFlashcardStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchSet(setId);
      await fetchCards(setId);
    };
    
    loadData();
  }, [fetchSet, fetchCards, setId]);

  // Calculate progress percentage with null check for stats
  const progressPercentage = stats && stats.total > 0 
    ? Math.round((stats.remembered / stats.total) * 100) 
    : 0;

  const getProgressColor = () => {
    if (progressPercentage >= 80) return colors.success;
    if (progressPercentage >= 50) return colors.primary;
    if (progressPercentage >= 20) return colors.warning;
    return colors.error;
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
            fetchCards(setId);
          }}
        />
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="bar-chart" size={64} color={colors.primaryLight} />
        <Text style={styles.emptyTitle}>No Data Available</Text>
        <Text style={styles.emptyText}>
          Add flashcards to this set to view statistics.
        </Text>
        <Button
          title="Add Flashcards"
          onPress={() => navigation.navigate('CreateCard', { setId })}
          style={styles.addButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentSet.title}</Text>
        <Text style={styles.subtitle}>Learning Progress</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: getProgressColor(), 
              }
            ]} 
          />
          <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
        </View>
        <Text style={styles.progressLabel}>Progress</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.total || 0}</Text>
          <Text style={styles.statLabel}>Total Cards</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {stats?.remembered || 0}
          </Text>
          <Text style={styles.statLabel}>Remembered</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.error }]}>
            {stats?.notRemembered || 0}
          </Text>
          <Text style={styles.statLabel}>To Learn</Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Card Details</Text>
        
        {cards.map((card, index) => (
          <View key={card.id} style={styles.cardItem}>
            <View 
              style={[
                styles.cardStatus, 
                { 
                  backgroundColor: card.isRemembered 
                    ? colors.success 
                    : colors.error 
                }
              ]} 
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardNumber}>{index + 1}</Text>
              <Text 
                style={styles.cardQuestion}
                numberOfLines={1}
              >
                {card.question}
              </Text>
            </View>
            <Text style={styles.cardState}>
              {card.isRemembered ? 'Learned' : 'Not yet'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actionSection}>
        <Button
          title="Continue Studying"
          onPress={() => navigation.navigate('StudyMode', { setId })}
          fullWidth
        />
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
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressSection: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  progressContainer: {
    height: 24,
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  detailSection: {
    padding: 16,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  cardStatus: {
    width: 8,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  cardQuestion: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  cardState: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionSection: {
    padding: 16,
    backgroundColor: colors.white,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
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
  addButton: {
    paddingHorizontal: 24,
  },
}); 