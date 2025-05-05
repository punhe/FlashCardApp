import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../../viewmodels/authStore';
import { useFlashcardSetStore } from '../../../viewmodels/flashcardSetStore';
import { colors } from '../../../utils/colors';
import { Button } from '../../components/Button';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { sets, fetchUserSets, isLoading } = useFlashcardSetStore();
  const [stats, setStats] = useState({
    totalSets: 0,
    totalCards: 0,
    learnedCards: 0,
    progressPercentage: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserSets(user.id);
    }
  }, [fetchUserSets, user]);

  useEffect(() => {
    if (sets.length > 0) {
      // In a real app, you would fetch this data from the API
      // For now, we'll generate some sample statistics
      let totalCards = 0;
      let learnedCards = 0;
      
      sets.forEach(set => {
        // Assume each set has a random number of cards between 5-20
        const cardCount = Math.floor(Math.random() * 15) + 5;
        totalCards += cardCount;
        
        // Assume a random number of cards have been learned
        const learned = Math.floor(Math.random() * cardCount);
        learnedCards += learned;
      });
      
      setStats({
        totalSets: sets.length,
        totalCards,
        learnedCards,
        progressPercentage: totalCards > 0 
          ? Math.round((learnedCards / totalCards) * 100) 
          : 0,
      });
    }
  }, [sets]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to log out');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <FontAwesome name="user-circle" size={80} color={colors.primary} />
        </View>
        <Text style={styles.name}>{user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Statistics</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalSets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalCards}</Text>
            <Text style={styles.statLabel}>Cards</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.learnedCards}</Text>
            <Text style={styles.statLabel}>Learned</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Learning Progress</Text>
            <Text style={styles.progressPercentage}>{stats.progressPercentage}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${stats.progressPercentage}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {sets.length > 0 ? (
          sets.slice(0, 3).map(set => (
            <View key={set.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <FontAwesome name="book" size={20} color={colors.primary} />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>{set.title}</Text>
                <Text style={styles.activityDescription}>
                  {set.description.length > 50 
                    ? set.description.substring(0, 50) + '...' 
                    : set.description
                  }
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyActivity}>
            <Text style={styles.emptyText}>
              You haven't created any flashcard sets yet.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.accountActions}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.accountActionItem}>
          <FontAwesome name="user" size={20} color={colors.primary} />
          <Text style={styles.accountActionText}>Edit Profile</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountActionItem}>
          <FontAwesome name="bell" size={20} color={colors.primary} />
          <Text style={styles.accountActionText}>Notifications</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountActionItem}>
          <FontAwesome name="lock" size={20} color={colors.primary} />
          <Text style={styles.accountActionText}>Change Password</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          type="secondary"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  recentActivityContainer: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyActivity: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  accountActions: {
    backgroundColor: colors.white,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  accountActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  accountActionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  logoutContainer: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
}); 