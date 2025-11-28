
export interface SkinScan {
  id: string;
  date: Date;
  imageUri: string;
  acneCount: number;
  whiteheadCount: number;
  hyperpigmentationLevel: number; // 0-100
  rednessLevel: number; // 0-100
  notes?: string;
}

export interface SkinMetric {
  date: string;
  value: number;
}

export interface RoutineSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'cleansing' | 'treatment' | 'moisturizing' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
}
