import type { TrendDatum } from "@/lib/dashboardTypes";
import { formatDateLabel } from "@/utils/format";

type ForecastSourcePoint = {
  label: string;
  timestamp: number;
  value: number;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getMedian = (values: number[]) => {
  if (values.length === 0) {
    return DAY_IN_MS;
  }

  const sortedValues = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  }

  return sortedValues[middleIndex];
};

export const buildForecastSeries = (
  sourcePoints: ForecastSourcePoint[],
  requestedPeriods?: number
): TrendDatum[] => {
  if (sourcePoints.length === 0) {
    return [];
  }

  const sortedPoints = [...sourcePoints].sort(
    (left, right) => left.timestamp - right.timestamp
  );

  const historicalSeries: TrendDatum[] = sortedPoints.map((point) => ({
    label: point.label,
    actual: point.value,
    forecast: null,
    isForecast: false,
    timestamp: point.timestamp,
  }));

  if (sortedPoints.length < 2) {
    return historicalSeries;
  }

  const indexValues = sortedPoints.map((_, index) => index);
  const yValues = sortedPoints.map((point) => point.value);
  const count = sortedPoints.length;

  const sumX = indexValues.reduce((sum, value) => sum + value, 0);
  const sumY = yValues.reduce((sum, value) => sum + value, 0);
  const sumXY = sortedPoints.reduce(
    (sum, point, index) => sum + index * point.value,
    0
  );
  const sumXX = indexValues.reduce((sum, value) => sum + value * value, 0);
  const denominator = count * sumXX - sumX * sumX;

  if (denominator === 0) {
    return historicalSeries;
  }

  const slope = (count * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / count;

  const spacingSeries = sortedPoints
    .slice(1)
    .map((point, index) => point.timestamp - sortedPoints[index].timestamp)
    .filter((gap) => gap > 0);

  const medianSpacing = Math.max(getMedian(spacingSeries), DAY_IN_MS);
  const defaultPeriods = Math.round((14 * DAY_IN_MS) / medianSpacing);
  const periods = Math.min(
    30,
    Math.max(7, requestedPeriods ?? defaultPeriods ?? 7)
  );

  const forecastSeries = [...historicalSeries];
  const lastTimestamp = sortedPoints.at(-1)?.timestamp ?? Date.now();
  const recentWindow = yValues.slice(-Math.min(5, yValues.length));
  const movingAverage =
    recentWindow.reduce((sum, value) => sum + value, 0) / recentWindow.length;

  for (let periodIndex = 0; periodIndex < periods; periodIndex += 1) {
    const x = count + periodIndex;
    const regressionValue = intercept + slope * x;
    const blendedForecast = regressionValue * 0.7 + movingAverage * 0.3;
    const nextTimestamp = lastTimestamp + medianSpacing * (periodIndex + 1);

    forecastSeries.push({
      label: formatDateLabel(new Date(nextTimestamp)),
      actual: null,
      forecast: Math.max(0, Number(blendedForecast.toFixed(2))),
      isForecast: true,
      timestamp: nextTimestamp,
    });
  }

  return forecastSeries;
};
