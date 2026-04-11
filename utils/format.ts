export const formatCompactNumber = (value: number) =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function formatSmartNumber(value: unknown): string {
  if (value === null || value === undefined) {
    return "0";
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    return "0";
  }

  const absoluteValue = Math.abs(num);

  if (absoluteValue >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }

  if (absoluteValue >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }

  return num.toFixed(0);
}

export const formatAxisValue = (value: unknown) => {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return "0";
  }

  if (Math.abs(num) >= 1000) {
    return formatCompactNumber(num);
  }

  return formatSmartNumber(num);
};

export const formatDateLabel = (date: Date) =>
  Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
