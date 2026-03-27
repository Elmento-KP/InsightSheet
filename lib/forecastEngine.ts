import type { TrendDatum } from "@/lib/dashboardTypes";

export const generateForecast = (
  values: number[],
  labels: string[],
  periods: number = 3
) : TrendDatum[] => {
  const n = values.length;

  if (n === 0) return [];

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }

  const denominator = (n * sumXX - sumX * sumX);

  if (denominator === 0) return [];

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const result: TrendDatum[] = values.map((value, index) => ({
    label: labels[index] || `Period ${index + 1}`,
    actual: value,
    forecast: null,
    isForecast: false
  }));

  for (let i = 0; i < periods; i++) {
    const predicted = slope * (n + i) + intercept;

    result.push({
      label: `Forecast ${i + 1}`,
      actual: null,
      forecast: Math.max(0, predicted),
      isForecast: true
    });
  }

  return result;
};
