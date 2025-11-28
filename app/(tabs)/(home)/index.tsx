
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useSkinData } from '@/hooks/useSkinData';
import { MetricCard } from '@/components/MetricCard';
import { SuggestionCard } from '@/components/SuggestionCard';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';
import { analyzeSkinImage } from '@/utils/imageAnalysis';
import { SkinScan } from '@/types/skinData';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { scans, loading, addScan, getLatestScan, generateSuggestions } = useSkinData();
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();

  const latestScan = getLatestScan();
  const suggestions = generateSuggestions();

  const handleTakeScan = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is needed to scan your face.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAnalyzing(true);
        
        // Analyze the image
        const analysis = await analyzeSkinImage(result.assets[0].uri);
        
        // Create new scan
        const newScan: SkinScan = {
          id: Date.now().toString(),
          date: new Date(),
          imageUri: result.assets[0].uri,
          ...analysis,
        };

        await addScan(newScan);
        setAnalyzing(false);
        
        Alert.alert(
          'Scan Complete!',
          'Your skin analysis has been saved.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Error taking scan:', error);
      setAnalyzing(false);
      Alert.alert('Error', 'Failed to process scan. Please try again.');
    }
  };

  const handleUploadScan = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Photo library permission is needed to upload images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAnalyzing(true);
        
        // Analyze the image
        const analysis = await analyzeSkinImage(result.assets[0].uri);
        
        // Create new scan
        const newScan: SkinScan = {
          id: Date.now().toString(),
          date: new Date(),
          imageUri: result.assets[0].uri,
          ...analysis,
        };

        await addScan(newScan);
        setAnalyzing(false);
        
        Alert.alert(
          'Scan Complete!',
          'Your skin analysis has been saved.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Error uploading scan:', error);
      setAnalyzing(false);
      Alert.alert('Error', 'Failed to process scan. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Smart Skin Tracker</Text>
          <Text style={styles.headerSubtitle}>
            {scans.length === 0
              ? 'Start your skin journey today'
              : `${scans.length} scan${scans.length === 1 ? '' : 's'} recorded`}
          </Text>
        </View>

        {/* Scan Buttons */}
        <View style={styles.scanButtons}>
          <TouchableOpacity
            style={[styles.scanButton, styles.primaryButton]}
            onPress={handleTakeScan}
            disabled={analyzing}
          >
            <IconSymbol
              ios_icon_name="camera.fill"
              android_material_icon_name="camera-alt"
              size={24}
              color={colors.card}
            />
            <Text style={styles.scanButtonText}>Take Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scanButton, styles.secondaryButton]}
            onPress={handleUploadScan}
            disabled={analyzing}
          >
            <IconSymbol
              ios_icon_name="photo"
              android_material_icon_name="photo-library"
              size={24}
              color={colors.accent}
            />
            <Text style={styles.scanButtonTextSecondary}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        {analyzing && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.analyzingText}>Analyzing your skin...</Text>
          </View>
        )}

        {/* Latest Metrics */}
        {latestScan && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Status</Text>
              <View style={styles.metricsGrid}>
                <MetricCard
                  title="Acne"
                  value={latestScan.acneCount}
                  icon="error"
                  isCount={true}
                />
                <MetricCard
                  title="Whiteheads"
                  value={latestScan.whiteheadCount}
                  icon="warning"
                  isCount={true}
                />
              </View>
              <View style={styles.metricsGrid}>
                <MetricCard
                  title="Hyperpigmentation"
                  value={latestScan.hyperpigmentationLevel}
                  icon="brightness-6"
                />
                <MetricCard
                  title="Redness"
                  value={latestScan.rednessLevel}
                  icon="local-fire-department"
                />
              </View>
            </View>

            {/* Suggestions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personalized Suggestions</Text>
                <IconSymbol
                  ios_icon_name="lightbulb.fill"
                  android_material_icon_name="lightbulb"
                  size={20}
                  color={colors.warning}
                />
              </View>
              {suggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </View>

            {/* View Progress Button */}
            <TouchableOpacity
              style={styles.progressButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <IconSymbol
                ios_icon_name="chart.bar.fill"
                android_material_icon_name="bar-chart"
                size={24}
                color={colors.card}
              />
              <Text style={styles.progressButtonText}>View Progress & History</Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.card}
              />
            </TouchableOpacity>
          </>
        )}

        {/* Empty State */}
        {!latestScan && !analyzing && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <IconSymbol
                ios_icon_name="face.smiling"
                android_material_icon_name="face"
                size={64}
                color={colors.accent}
              />
            </View>
            <Text style={styles.emptyTitle}>Welcome to Smart Skin Tracker!</Text>
            <Text style={styles.emptyText}>
              Take your first scan to start tracking your skin health journey.
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.success}
                />
                <Text style={styles.featureText}>Track acne and whiteheads</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.success}
                />
                <Text style={styles.featureText}>Monitor hyperpigmentation</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.success}
                />
                <Text style={styles.featureText}>Get personalized suggestions</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.success}
                />
                <Text style={styles.featureText}>Visualize your progress</Text>
              </View>
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scanButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  scanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.accent,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  scanButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  analyzingContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  analyzingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  progressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 24,
  },
  progressButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresList: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});
