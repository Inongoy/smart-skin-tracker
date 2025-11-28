
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import { getMetricColor, getMetricStatus } from '@/utils/imageAnalysis';

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
  isCount?: boolean;
}

export function MetricCard({ title, value, icon, isCount = false }: MetricCardProps) {
  const metricColor = getMetricColor(value, isCount);
  const status = getMetricStatus(value, isCount);

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: metricColor + '20' }]}>
        <IconSymbol
          ios_icon_name={icon}
          android_material_icon_name={icon as any}
          size={28}
          color={metricColor}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}{isCount ? '' : '%'}</Text>
      <Text style={[styles.status, { color: metricColor }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: 150,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});
