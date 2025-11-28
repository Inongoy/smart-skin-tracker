
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { RoutineSuggestion } from '@/types/skinData';
import { IconSymbol } from './IconSymbol';

interface SuggestionCardProps {
  suggestion: RoutineSuggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const getCategoryIcon = () => {
    switch (suggestion.category) {
      case 'cleansing':
        return 'water-drop';
      case 'treatment':
        return 'healing';
      case 'moisturizing':
        return 'opacity';
      case 'lifestyle':
        return 'wb-sunny';
      default:
        return 'info';
    }
  };

  const getPriorityColor = () => {
    switch (suggestion.priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <IconSymbol
            ios_icon_name={getCategoryIcon()}
            android_material_icon_name={getCategoryIcon() as any}
            size={24}
            color={colors.accent}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{suggestion.title}</Text>
          <View style={styles.priorityBadge}>
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: getPriorityColor() },
              ]}
            />
            <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
              {suggestion.priority.toUpperCase()} PRIORITY
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{suggestion.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
