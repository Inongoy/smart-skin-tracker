
import { useState, useEffect } from 'react';
import { SkinScan, RoutineSuggestion } from '@/types/skinData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@skin_scans';

export function useSkinData() {
  const [scans, setScans] = useState<SkinScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const storedScans = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedScans) {
        const parsedScans = JSON.parse(storedScans);
        // Convert date strings back to Date objects
        const scansWithDates = parsedScans.map((scan: any) => ({
          ...scan,
          date: new Date(scan.date),
        }));
        setScans(scansWithDates);
      }
    } catch (error) {
      console.log('Error loading scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const addScan = async (scan: SkinScan) => {
    try {
      const updatedScans = [scan, ...scans];
      setScans(updatedScans);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScans));
    } catch (error) {
      console.log('Error saving scan:', error);
    }
  };

  const deleteScan = async (scanId: string) => {
    try {
      const updatedScans = scans.filter(scan => scan.id !== scanId);
      setScans(updatedScans);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScans));
    } catch (error) {
      console.log('Error deleting scan:', error);
    }
  };

  const getLatestScan = (): SkinScan | null => {
    if (scans.length === 0) return null;
    return scans[0];
  };

  const getMetricHistory = (metric: 'acne' | 'whitehead' | 'hyperpigmentation' | 'redness') => {
    return scans.map(scan => {
      let value = 0;
      switch (metric) {
        case 'acne':
          value = scan.acneCount;
          break;
        case 'whitehead':
          value = scan.whiteheadCount;
          break;
        case 'hyperpigmentation':
          value = scan.hyperpigmentationLevel;
          break;
        case 'redness':
          value = scan.rednessLevel;
          break;
      }
      return {
        date: scan.date.toISOString().split('T')[0],
        value,
      };
    }).reverse();
  };

  const generateSuggestions = (): RoutineSuggestion[] => {
    const latestScan = getLatestScan();
    if (!latestScan) return [];

    const suggestions: RoutineSuggestion[] = [];

    if (latestScan.acneCount > 5) {
      suggestions.push({
        id: '1',
        title: 'Use Salicylic Acid Cleanser',
        description: 'Salicylic acid helps unclog pores and reduce acne breakouts.',
        category: 'cleansing',
        priority: 'high',
      });
    }

    if (latestScan.whiteheadCount > 3) {
      suggestions.push({
        id: '2',
        title: 'Apply Benzoyl Peroxide Treatment',
        description: 'Benzoyl peroxide effectively targets whiteheads and prevents new ones.',
        category: 'treatment',
        priority: 'high',
      });
    }

    if (latestScan.hyperpigmentationLevel > 40) {
      suggestions.push({
        id: '3',
        title: 'Use Vitamin C Serum',
        description: 'Vitamin C brightens skin and reduces hyperpigmentation over time.',
        category: 'treatment',
        priority: 'medium',
      });
      suggestions.push({
        id: '4',
        title: 'Apply Sunscreen Daily',
        description: 'SPF 30+ sunscreen prevents further hyperpigmentation.',
        category: 'lifestyle',
        priority: 'high',
      });
    }

    if (latestScan.rednessLevel > 50) {
      suggestions.push({
        id: '5',
        title: 'Use Gentle, Fragrance-Free Products',
        description: 'Reduce irritation by avoiding harsh ingredients and fragrances.',
        category: 'cleansing',
        priority: 'high',
      });
      suggestions.push({
        id: '6',
        title: 'Apply Niacinamide Serum',
        description: 'Niacinamide reduces redness and strengthens skin barrier.',
        category: 'treatment',
        priority: 'medium',
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        id: '7',
        title: 'Maintain Your Current Routine',
        description: 'Your skin looks great! Keep up with your current skincare routine.',
        category: 'lifestyle',
        priority: 'low',
      });
    }

    return suggestions;
  };

  return {
    scans,
    loading,
    addScan,
    deleteScan,
    getLatestScan,
    getMetricHistory,
    generateSuggestions,
  };
}
