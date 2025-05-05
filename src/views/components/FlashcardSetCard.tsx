import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../../utils/colors';
import { FlashcardSet } from '../../models/types';
import { FontAwesome } from '@expo/vector-icons';

interface FlashcardSetCardProps extends TouchableOpacityProps {
  set: FlashcardSet;
  cardCount?: number;
  onPress: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  onStudyPress?: () => void;
  onSharePress?: () => void;
  onStatsPress?: () => void;
  showActions?: boolean;
}

export function FlashcardSetCard({
  set,
  cardCount = 0,
  onPress,
  onEditPress,
  onDeletePress,
  onStudyPress,
  onSharePress,
  onStatsPress,
  showActions = true,
  style,
  ...props
}: FlashcardSetCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{set.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{set.description}</Text>
        <Text style={styles.cardCount}>{cardCount} cards</Text>
      </View>

      {showActions && (
        <View style={styles.actionContainer}>
          {onStudyPress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onStudyPress}
            >
              <FontAwesome name="graduation-cap" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {onStatsPress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onStatsPress}
            >
              <FontAwesome name="bar-chart" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {onSharePress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSharePress}
            >
              <FontAwesome name="share-alt" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {onEditPress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onEditPress}
            >
              <FontAwesome name="edit" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {onDeletePress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onDeletePress}
            >
              <FontAwesome name="trash" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderColor: colors.divider,
    paddingTop: 12,
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 