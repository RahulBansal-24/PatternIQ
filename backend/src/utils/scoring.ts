export const calculateProfessionalEfficiencyScore = (
  taskCompletionRate: number,
  planningAccuracy: number,
  productiveScreenTime: number,
  totalScreenTime: number,
  consistencyScore: number
): number => {
  const screenTimeRatio = totalScreenTime > 0 ? productiveScreenTime / totalScreenTime : 0.5;
  
  const score = (
    (taskCompletionRate * 0.35) +
    (planningAccuracy * 0.25) +
    (screenTimeRatio * 100 * 0.2) +
    (consistencyScore * 0.2)
  );

  return Math.min(100, Math.max(0, Math.round(score)));
};

export const calculateWellbeingScore = (
  mood: number,
  energy: number,
  motivation: number,
  reflectionSentiment: number
): number => {
  const score = (
    (mood * 0.3) +
    (energy * 0.25) +
    (motivation * 0.25) +
    (reflectionSentiment * 0.2)
  );

  return Math.min(100, Math.max(0, Math.round(score)));
};

export const normalizeMoodToScore = (mood: string): number => {
  const moodScores: { [key: string]: number } = {
    'very_negative': 10,
    'negative': 30,
    'neutral': 50,
    'positive': 70,
    'very_positive': 90
  };
  return moodScores[mood] || 50;
};

export const normalizeEnergyToScore = (energy: string): number => {
  const energyScores: { [key: string]: number } = {
    'very_low': 10,
    'low': 30,
    'medium': 50,
    'high': 70,
    'very_high': 90
  };
  return energyScores[energy] || 50;
};

export const normalizeMotivationToScore = (motivation: string): number => {
  const motivationScores: { [key: string]: number } = {
    'very_low': 10,
    'low': 30,
    'medium': 50,
    'high': 70,
    'very_high': 90
  };
  return motivationScores[motivation] || 50;
};
