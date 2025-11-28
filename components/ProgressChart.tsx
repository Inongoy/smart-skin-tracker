
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { SkinMetric } from '@/types/skinData';

interface ProgressChartProps {
  title: string;
  data: SkinMetric[];
  color: string;
  isCount?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 64;
const CHART_HEIGHT = 180;

export function ProgressChart({ title, data, color, isCount = false }: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data yet. Start scanning to see your progress!</Text>
        </View>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  const getBarHeight = (value: number) => {
    const normalized = (value - minValue) / range;
    return Math.max(normalized * (CHART_HEIGHT - 40), 4);
  };

  const displayData = data.slice(-7); // Show last 7 data points

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {displayData.map((item, index) => {
              const barHeight = getBarHeight(item.value);
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <Text style={styles.valueLabel}>{item.value}{isCount ? '' : '%'}</Text>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.dateLabel}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    minWidth: CHART_WIDTH,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    gap: 12,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    minWidth: 50,
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
    minHeight: 4,
  },
  valueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
