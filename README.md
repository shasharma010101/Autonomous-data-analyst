# Autonomous Data Analyst — AI Agent
**Final Year College Capstone Project**

---

## 🌟 Project Overview
**Autonomous Data Analyst** is an interactive, intelligent AI Agent application designed to automate dataset exploration, statistical aggregation, data profiling, natural language querying, and dynamic chart visualization directly from CSV files.

Built with a modern, warm ivory and amber/yellow aesthetic, the agent features a centered conversation interface, intuitive attachment handling, and an autonomous analytical engine that runs directly in any modern web browser without requiring third-party runtime dependencies or internet connectivity.

---

## 🚀 How to Run the Server & Access Links

### Option 1: One-Click Local Server (Recommended for College Viva)
1. Double-click the **[`run.bat`](file:///c:/Users/TEMP/Downloads/AI%20Project/run.bat)** file.
2. It starts a local web server and automatically opens:
   👉 **[http://localhost:8000/](http://localhost:8000/)**
3. The console will display server logs and request details. Keep the console window open while using the application.

---

### Option 2: Direct Offline Browser Access
- You can directly open **[`index.html`](file:///c:/Users/TEMP/Downloads/AI%20Project/index.html)** in any browser.
- Direct URL: **`file:///c:/Users/TEMP/Downloads/AI%20Project/index.html`**
- It runs 100% locally with zero setup, zero port configuration, and zero internet required!

---

## 🎯 Key Features
- **Central Chat Interface**: Clean, centered dialogue interface with intelligent query processing.
- **Attachment Integration**: Easily attach any `.csv` file using the **📎 attachment button** directly next to the input box.
- **Embedded Sample Datasets**: Includes three complete pre-loaded datasets for instant college demonstrations:
  1. `sales_data.csv` (E-commerce orders, categories, revenue, profit, regions)
  2. `student_performance.csv` (Grades, attendance rate, study hours, departments)
  3. `employee_analytics.csv` (Salaries, job roles, ratings, attrition risk)
- **Autonomous Intent Classifier & Reasoning Engine**:
  - Classifies prompts into intents: *Schema Inspection, Executive Summaries, Top/Bottom N Rankings, Group By Aggregations, Correlation Matrices, Conditional Filtering*.
  - Displays internal reasoning steps in an **Agent Thought** badge (`⚡`) for transparent AI decision-making.
- **Self-Contained Canvas Chart Engine**:
  - Automatically draws beautiful Bar Charts and Doughnut/Pie Charts with crisp labels and warm color gradients.
  - 100% self-contained with zero external CDN requirements (ideal for offline classroom presentations).
- **Interactive Data Tables & Export**:
  - Previews tabular subsets and allows full dataset modal inspection.
  - Built-in "Export as CSV" functionality for filtered queries.

---

## 💡 Example Prompts for College Viva / Demo
Once a dataset is loaded (e.g. `sales_data.csv`), test these natural language prompts:

1. **Executive Summary**:
   > *"Give me an executive summary of this dataset."*
2. **Aggregations & Charts**:
   > *"Show total sales by product category as a bar chart."*
   > *"What is the average profit by region?"*
3. **Rankings (Top N / Bottom N)**:
   > *"What are the top 5 most profitable orders?"*
   > *"Show bottom 3 lowest sales records."*
4. **Statistical Math**:
   > *"What is the average unit price and total revenue?"*
   > *"What is the maximum salary?"*
5. **Relationships & Correlation**:
   > *"Find correlations and patterns between numeric columns."*
6. **Filtering**:
   > *"Show records where profit < 30."*
   > *"Filter students who passed."*
7. **Schema Inspection**:
   > *"What columns and data types are in this dataset?"*

---

## 📁 Directory Structure
```
AI Project/
│
├── index.html                   # Main User Interface
├── style.css                    # Warm yellow & white modern styling
├── app.js                       # Autonomous AI Agent core engine & canvas chart renderer
├── run.bat                      # 1-click launcher for Windows
├── README.md                    # Project documentation & presentation guide
│
└── sample_data/                 # Ready-to-use sample CSV files
    ├── sales_data.csv
    ├── student_performance.csv
    └── employee_analytics.csv
```

---

## 🎓 College Viva & Evaluation Notes
- **Problem Statement**: Traditional BI and spreadsheet tools require manual formula writing and pivot table configuration. This project solves that by employing an Autonomous Agent architecture that maps plain English inquiries to analytical operations.
- **Agent Architecture**:
  - **Perception Layer**: File ingestion, delimiter detection, and RFC-4180 parsing.
  - **Cognitive Layer**: Intent classification, tokenization, fuzzy column resolver, statistical aggregation pipeline.
  - **Action Layer**: Structured narrative generation, canvas rendering, and data table synthesis.
