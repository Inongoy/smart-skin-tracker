
import { SkinScan } from '@/types/skinData';

// Simulated image analysis function
// In a real app, this would use computer vision APIs or ML models
export async function analyzeSkinImage(imageUri: string): Promise<Omit<SkinScan, 'id' | 'date' | 'imageUri'>> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate random but realistic values for demo purposes
  // In production, this would use actual image analysis
  const acneCount = Math.floor(Math.random() * 15);
  const whiteheadCount = Math.floor(Math.random() * 10);
  const hyperpigmentationLevel = Math.floor(Math.random() * 100);
  const rednessLevel = Math.floor(Math.random() * 100);

  return {
    acneCount,
    whiteheadCount,
    hyperpigmentationLevel,
    rednessLevel,
  };
}

export function getMetricColor(value: number, isCount: boolean = false): string {
  if (isCount) {
    if (value === 0) return '#90EE90'; // Green
    if (value <= 3) return '#FFD700'; // Yellow
    return '#FF6B6B'; // Red
  } else {
    if (value < 30) return '#90EE90'; // Green
    if (value < 60) return '#FFD700'; // Yellow
    return '#FF6B6B'; // Red
  }
}

export function getMetricStatus(value: number, isCount: boolean = false): string {
  if (isCount) {
    if (value === 0) return 'Excellent';
    if (value <= 3) return 'Good';
    if (value <= 7) return 'Fair';
    return 'Needs Attention';
  } else {
    if (value < 30) return 'Low';
    if (value < 60) return 'Moderate';
    return 'High';
  }
}
