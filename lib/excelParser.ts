import * as XLSX from "xlsx";
import type { DataRow } from "@/lib/dashboardTypes";

const excelDateToJS = (serial: number) => {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
};

export const parseFile = async (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: DataRow[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: null,
        });

        const normalizedData = jsonData.map((row) => {
          const newRow: DataRow = {};

          Object.entries(row).forEach(([key, value]) => {

            if (typeof value === "number" && key.toLowerCase().includes("date")) {
              const date = excelDateToJS(value);
              newRow[key] = date.toISOString().split("T")[0];
            }

            else if (!isNaN(Number(value))) {
              newRow[key] = Number(value);
            }

            else {
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
