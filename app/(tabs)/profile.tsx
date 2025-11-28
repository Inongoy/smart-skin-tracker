
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useSkinData } from '@/hooks/useSkinData';
import { ProgressChart } from '@/components/ProgressChart';
import { ScanCard } from '@/components/ScanCard';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const { scans, getMetricHistory, deleteScan } = useSkinData();

  const acneHistory = getMetricHistory('acne');
  const whiteheadHistory = getMetricHistory('whitehead');
  const hyperpigmentationHistory = getMetricHistory('hyperpigmentation');
  const rednessHistory = getMetricHistory('redness');

  const handleDeleteScan = (scanId: string) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteScan(scanId),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress & History</Text>
          <Text style={styles.headerSubtitle}>
            Track your skin health over time
          </Text>
        </View>

        {scans.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <IconSymbol
                ios_icon_name="chart.bar"
                android_material_icon_name="bar-chart"
                size={64}
                color={colors.accent}
              />
            </View>
            <Text style={styles.emptyTitle}>No Data Yet</Text>
            <Text style={styles.emptyText}>
              Take your first scan to start tracking your progress!
            </Text>
          </View>
        ) : (
          <>
            {/* Progress Charts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Progress Charts</Text>
              <ProgressChart
                title="Acne Count"
                data={acneHistory}
                color={colors.error}
                isCount={true}
              />
              <ProgressChart
                title="Whitehead Count"
                data={whiteheadHistory}
                color={colors.warning}
                isCount={true}
              />
              <ProgressChart
                title="Hyperpigmentation Level"
                data={hyperpigmentationHistory}
                color={colors.accent}
              />
              <ProgressChart
                title="Redness Level"
                data={rednessHistory}
                color={colors.highlight}
              />
            </View>

            {/* Scan History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scan History</Text>
              {scans.map((scan) => (
                <View key={scan.id} style={styles.scanCardContainer}>
                  <ScanCard scan={scan} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteScan(scan.id)}
                  >
                    <IconSymbol
                      ios_icon_name="trash"
                      android_material_icon_name="delete"
                      size={20}
                      color={colors.error}
                    />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Stats Summary */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Summary</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Scans:</Text>
                <Text style={styles.statValue}>{scans.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>First Scan:</Text>
                <Text style={styles.statValue}>
                  {scans[scans.length - 1]?.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Latest Scan:</Text>
                <Text style={styles.statValue}>
                  {scans[0]?.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  scanCardContainer: {
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: -8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
