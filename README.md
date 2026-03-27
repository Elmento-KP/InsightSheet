# InsightSheet – Excel Dashboard Generator

## Overview

InsightSheet is a web application that allows users to upload Excel files and automatically generate dashboards, charts, KPIs, and insights from the uploaded data. The goal of this project is to convert raw Excel data into meaningful visual analytics instantly.

This project was built as a portfolio project to demonstrate skills in data processing, dashboard development, and web application development.

---

## Features

* Upload Excel (.xlsx) files
* Automatically read and parse Excel data
* Select columns for:

  * Category
  * Metric
  * Date
* Generate charts:

  * Bar Chart
  * Line Chart
  * Pie Chart
* KPI Cards:

  * Total
  * Average
  * Maximum
  * Minimum
* Data Table Preview
* Aggregation Options:

  * Sum
  * Average
  * Count
  * Max
  * Min
* Responsive Dashboard UI

---

## Tech Stack

* Next.js
* React
* Tailwind CSS
* XLSX (Excel parsing)
* Chart.js / Recharts
* JavaScript

---

## How It Works

1. Upload Excel file
2. Select category, metric, and date columns
3. Choose aggregation type
4. Dashboard is generated automatically
5. Charts and KPIs are displayed
6. Analyze and download insights

---

## Project Structure

/components
/charts
/dashboard
/upload
/utils
/app

---

## Future Improvements

* AI-generated insights
* Forecasting
* Export dashboard as PDF
* Save dashboards
* User authentication
* Cloud storage
* Deploy as SaaS product

---

## Goal of the Project

The goal of this project is to build a mini Business Intelligence tool similar to Power BI or Tableau that works directly with Excel files in a web application.

---

## Sample Data for Testing

To help users test the application, a sample Excel file has been provided in this repository.

You can download the sample Excel file and upload it into the application to see how the dashboard, charts, and KPIs are generated automatically.

### Steps to Test

1. Download the sample Excel file from the repository.
2. Open the InsightSheet web application.
3. Upload the sample Excel file.
4. Select:

   * Category Column
   * Metric Column
   * Date Column (optional)
   * Aggregation Type (Sum, Average, Count, etc.)
5. The dashboard will be generated automatically with charts and KPI metrics.

The sample dataset contains sales data including products, regions, dates, units sold, and revenue, which can be used to test charts, KPIs, and forecasting features.

---

## Author

Developed as a part of portfolio project for data analytics / business analytics / consulting career path.
By Krupal Patel .
