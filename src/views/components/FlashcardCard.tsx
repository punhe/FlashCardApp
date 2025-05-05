import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { colors } from '../../utils/colors';
import { Flashcard } from '../../models/types';
import { FontAwesome } from '@expo/vector-icons';

interface FlashcardCardProps {
  card: Flashcard;
  onRememberedPress?: (id: string, value: boolean) => void;
  showActions?: boolean;
  isFlippable?: boolean;
}

export function FlashcardCard({
  card,
  onRememberedPress,
  showActions = true,
  isFlippable = true,
}: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    animatedValue.setValue(0);
    setIsFlipped(false);
  }, [card.id]);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0]
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1]
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  const flipCard = () => {
    if (!isFlippable) return;
    
    // Add haptic feedback here if available
    
    if (isFlipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const handleRememberedPress = (remembered: boolean) => {
    if (onRememberedPress) {
      onRememberedPress(card.id, remembered);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={flipCard}
        style={[styles.cardContainer, isFlippable && styles.tappableCard]}
      >
        <View style={styles.flipContainer}>
          <Animated.View
            style={[styles.card, frontAnimatedStyle, styles.cardFront]}
          >
            <Text style={styles.question}>{card.question}</Text>
            {isFlippable && (
              <View style={styles.flipHintContainer}>
                <FontAwesome name="repeat" size={14} color={colors.textSecondary} />
                <Text style={styles.flipHint}> Tap to flip</Text>
              </View>
            )}
          </Animated.View>

          <Animated.View
            style={[styles.card, backAnimatedStyle, styles.cardBack]}
          >
            <Text style={styles.answer}>{card.answer}</Text>
            {isFlippable && (
              <View style={styles.flipHintContainer}>
                <FontAwesome name="repeat" size={14} color={colors.textSecondary} />
                <Text style={styles.flipHint}> Tap to flip</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>

      {showActions && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.forgotButton]}
            onPress={() => handleRememberedPress(false)}
          >
            <FontAwesome name="times" size={24} color={colors.white} />
            <Text style={styles.actionText}>Forgot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rememberedButton]}
            onPress={() => handleRememberedPress(true)}
          >
            <FontAwesome name="check" size={24} color={colors.white} />
            <Text style={styles.actionText}>Remembered</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 3 / 2,
    maxWidth: 400,
  },
  flipContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
  },
  cardFront: {
    backgroundColor: colors.white,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardBack: {
    backgroundColor: colors.primaryLight,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  answer: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  flipHintContainer: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  flipHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '48%',
  },
  forgotButton: {
    backgroundColor: colors.error,
  },
  rememberedButton: {
    backgroundColor: colors.success,
  },
  actionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tappableCard: {
    cursor: 'pointer',
    transform: [{ perspective: 1000 }],
  },
}); 