import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../../utils/colors';
import { FontAwesome } from '@expo/vector-icons';

export default function SettingsScreen() {
  // App settings state
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [autoFlip, setAutoFlip] = useState(false);
  const [flipTimeout, setFlipTimeout] = useState(5); // In seconds

  const showComingSoonAlert = () => {
    Alert.alert(
      'Coming Soon',
      'This feature is currently in development and will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const resetAppData = () => {
    Alert.alert(
      'Reset App Data',
      'Are you sure you want to reset all app data? This action cannot be undone and will delete all your flashcards and sets.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to reset data
            Alert.alert('Success', 'App data has been reset');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="moon-o" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.divider, true: colors.primaryLight }}
            thumbColor={darkMode ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={showComingSoonAlert}
        >
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="font" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Text Size</Text>
          </View>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>Medium</Text>
            <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="bell" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Enable Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.divider, true: colors.primaryLight }}
            thumbColor={notifications ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="clock-o" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Study Reminders</Text>
          </View>
          <Switch
            value={studyReminders}
            onValueChange={setStudyReminders}
            disabled={!notifications}
            trackColor={{ false: colors.divider, true: colors.primaryLight }}
            thumbColor={studyReminders && notifications ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.settingItem, !notifications && styles.disabledSetting]}
          onPress={notifications ? showComingSoonAlert : undefined}
        >
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="calendar" size={20} color={notifications ? colors.primary : colors.textSecondary} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, !notifications && styles.disabledText]}>
              Reminder Schedule
            </Text>
          </View>
          <View style={styles.settingValueContainer}>
            <Text style={[styles.settingValue, !notifications && styles.disabledText]}>
              Daily
            </Text>
            <FontAwesome 
              name="chevron-right" 
              size={16} 
              color={notifications ? colors.textSecondary : colors.divider} 
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="refresh" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Auto-flip Cards</Text>
          </View>
          <Switch
            value={autoFlip}
            onValueChange={setAutoFlip}
            trackColor={{ false: colors.divider, true: colors.primaryLight }}
            thumbColor={autoFlip ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.settingItem, !autoFlip && styles.disabledSetting]}
          onPress={autoFlip ? showComingSoonAlert : undefined}
        >
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="hourglass" size={20} color={autoFlip ? colors.primary : colors.textSecondary} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, !autoFlip && styles.disabledText]}>
              Flip Timeout
            </Text>
          </View>
          <View style={styles.settingValueContainer}>
            <Text style={[styles.settingValue, !autoFlip && styles.disabledText]}>
              {flipTimeout} seconds
            </Text>
            <FontAwesome 
              name="chevron-right" 
              size={16} 
              color={autoFlip ? colors.textSecondary : colors.divider} 
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={showComingSoonAlert}
        >
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="info-circle" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>About FlashLearn</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={showComingSoonAlert}
        >
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="file-text" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={showComingSoonAlert}
        >
          <View style={styles.settingLabelContainer}>
            <FontAwesome name="question-circle" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Help & Support</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>FlashLearn v1.0.0</Text>
        </View>
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
        
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={resetAppData}
        >
          <FontAwesome name="trash" size={20} color={colors.error} />
          <Text style={styles.dangerButtonText}>Reset App Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.white,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  disabledSetting: {
    opacity: 0.6,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dangerZone: {
    backgroundColor: colors.error + '10',
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
}); 