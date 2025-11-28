
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { SkinScan } from '@/types/skinData';
import { IconSymbol } from './IconSymbol';

interface ScanCardProps {
  scan: SkinScan;
  onPress?: () => void;
}

export function ScanCard({ scan, onPress }: ScanCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: scan.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.date}>{formatDate(scan.date)}</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <IconSymbol
              ios_icon_name="circle.fill"
              android_material_icon_name="circle"
              size={12}
              color={colors.error}
            />
            <Text style={styles.metricText}>{scan.acneCount} acne</Text>
          </View>
          <View style={styles.metric}>
            <IconSymbol
              ios_icon_name="circle.fill"
              android_material_icon_name="circle"
              size={12}
              color={colors.warning}
            />
            <Text style={styles.metricText}>{scan.whiteheadCount} whiteheads</Text>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Hyperpigmentation:</Text>
            <Text style={styles.metricValue}>{scan.hyperpigmentationLevel}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Redness:</Text>
            <Text style={styles.metricValue}>{scan.rednessLevel}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metricLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
