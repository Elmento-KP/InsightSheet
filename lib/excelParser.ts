import * as XLSX from "xlsx";
import type { DataRow } from "@/lib/dashboardTypes";

const excelDateToJS = (serial: number) => {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
};

export const parseFile = async (file: File): Promise<DataRow[]> => {
  const supportedFile = /\.(xlsx|xls|csv)$/i.test(file.name);

  if (!supportedFile) {
    throw new Error("Please upload an Excel or CSV file (.xlsx, .xls, or .csv).");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error("This workbook does not contain any sheets.");
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error("We could not read the first worksheet in this workbook.");
        }

        const jsonData: DataRow[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: null,
        });

        if (jsonData.length === 0) {
          throw new Error("The uploaded file is empty or contains only blank rows.");
        }

        const normalizedData = jsonData.map((row) => {
          const newRow: DataRow = {};

          Object.entries(row).forEach(([key, value]) => {
            if (typeof value === "number" && key.toLowerCase().includes("date")) {
              const date = excelDateToJS(value);
              newRow[key] = date.toISOString().split("T")[0];
            } else if (typeof value === "string" && value.trim().length === 0) {
              newRow[key] = null;
            } else if (!Number.isNaN(Number(value)) && value !== null && value !== "") {
              newRow[key] = Number(value);
            } else {
              newRow[key] = value;
            }
          });

          return newRow;
        });

        const cleanedData = normalizedData.filter((row) =>
          Object.values(row).some((val) => val !== null && val !== "")
        );

        resolve(cleanedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the selected file."));
    };

    reader.readAsArrayBuffer(file);
  });
};
