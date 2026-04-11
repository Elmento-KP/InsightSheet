export const formatCompactNumber = (value: number) =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const formatSmartNumber = (value: number) => {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1000) {
    return formatCompactNumber(value);
  }

  if (Number.isInteger(value)) {
    return Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  }

  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatAxisValue = (value: number) => {
  if (Math.abs(value) >= 1000) {
    return formatCompactNumber(value);
  }

  return formatSmartNumber(value);
};

export const formatDateLabel = (date: Date) =>
  Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
