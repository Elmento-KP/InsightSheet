import type { ColumnSelection, DataRow } from "@/lib/dashboardTypes";

const isDateLike = (value: unknown) => {
  if (typeof value !== "string") {
    return false;
  }

  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
};

export const inferColumnSelection = (
  data: DataRow[],
  columns: string[]
): ColumnSelection => {
  if (data.length === 0 || columns.length === 0) {
    return {
      metricColumn: "",
      categoryColumn: "",
      dateColumn: "",
      aggregationType: "sum",
      revenueColumn: "",
      costColumn: "",
      channelColumn: "",
    };
  }

  let metricColumn = "";
  let categoryColumn = "";
  let dateColumn = "";
  let revenueColumn = "";
  let costColumn = "";
  let channelColumn = "";

  for (const column of columns) {
    const sampleValues = data
      .slice(0, 20)
      .map((row) => row[column])
      .filter((value) => value !== null && value !== "");

    if (sampleValues.length === 0) {
      continue;
    }

    const numericCount = sampleValues.filter(
      (value) => typeof value === "number" && Number.isFinite(value)
    ).length;

    const stringCount = sampleValues.filter(
      (value) => typeof value === "string" && value.trim().length > 0
    ).length;

    const dateLikeCount = sampleValues.filter(isDateLike).length;
    const normalizedColumn = column.toLowerCase();

    if (!revenueColumn && normalizedColumn.includes("revenue")) {
      revenueColumn = column;
    }

    if (!costColumn && normalizedColumn.includes("cost")) {
      costColumn = column;
    }

    if (!channelColumn && normalizedColumn.includes("channel")) {
      channelColumn = column;
    }

    if (
      !dateColumn &&
      (normalizedColumn.includes("date") ||
        normalizedColumn.includes("time") ||
        dateLikeCount >= Math.ceil(sampleValues.length * 0.7))
    ) {
      dateColumn = column;
      continue;
    }

    if (
      !metricColumn &&
      numericCount >= Math.ceil(sampleValues.length * 0.7)
    ) {
      metricColumn = column;
      continue;
    }

    if (
      !categoryColumn &&
      stringCount >= Math.ceil(sampleValues.length * 0.7)
    ) {
      categoryColumn = column;
    }
  }

  return {
    metricColumn,
    categoryColumn,
    dateColumn,
    aggregationType: "sum",
    revenueColumn,
    costColumn,
    channelColumn,
  };
};
