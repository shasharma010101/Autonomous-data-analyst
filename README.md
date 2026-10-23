# Autonomous Data Analyst — AI Agent
**Final Year College Capstone Project**

---

## 🌟 Project Overview
**Autonomous Data Analyst** is an interactive, intelligent AI Agent application designed to automate dataset exploration, statistical aggregation, data profiling, natural language querying, and dynamic chart visualization directly from CSV files.

Built with a modern, warm ivory and amber/yellow aesthetic, the agent features a centered conversation interface, intuitive attachment handling, and an autonomous analytical engine that runs directly in any modern web browser without requiring third-party runtime dependencies or internet connectivity.

---

## 🚀 How to Run the Server & Access Links

### Option 1: One-Click Local Server (Recommended for College Viva)

**Windows:** double-click **[`run.bat`](run.bat)**.

**Linux / macOS:** run `./run.sh` in a terminal (requires Python 3).

Both launchers start a local web server and automatically open:
👉 **[http://localhost:8000/](http://localhost:8000/)**

The console displays server logs and request details. Keep the terminal window open while using the application. If port 8000 is already in use, the next free port is chosen automatically.

> **Note for Linux users:** do **not** run `run.bat` through Wine. `run.bat` calls Windows PowerShell, which Wine does not provide (it ships only a no-op stub), so the server silently never starts. Use `run.sh`/`serve.py` instead.

---

### Option 2: Direct Offline Browser Access
- You can directly open **[`index.html`](index.html)** in any browser.
- It runs 100% locally with zero setup, zero port configuration, and zero internet required!

---

## Key Features
- **Central Chat Interface**: Clean, centered dialogue interface with intelligent query processing.
- **Attachment Integration**: Easily attach any `.csv` file using the **📎 attachment button** directly next to the input box.
- **Embedded Sample Datasets**: Includes three complete pre-loaded datasets for instant college demonstrations:
  1. `sales_data.csv` (E-commerce orders, categories, revenue, profit, regions)
  2. `student_performance.csv` (Grades, attendance rate, study hours, departments)
  3. `employee_analytics.csv` (Salaries, job roles, ratings, attrition risk)
- **Autonomous Intent Classifier & Reasoning Engine**:
  - Classifies prompts into intents: *Schema Inspection, Executive Summaries, Top/Bottom N Rankings, Group By Aggregations, Correlation Matrices, Conditional Filtering*.
  - Displays internal reasoning steps in an **Agent Thought** badge  for transparent AI decision-making.
- **Self-Contained Canvas Chart Engine**:
  - Automatically draws beautiful Bar Charts and Doughnut/Pie Charts with crisp labels and warm color gradients.
  - 100% self-contained with zero external CDN requirements (ideal for offline classroom presentations).
- **Interactive Data Tables & Export**:
  - Previews tabular subsets and allows full dataset modal inspection.
  - Built-in "Export as CSV" functionality for filtered queries.

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

## Directory Structure
```
AI Project/
│
├── index.html                   # Main User Interface
├── style.css                    # Warm yellow & white modern styling
├── app.js                       # Autonomous AI Agent core engine & canvas chart renderer
├── run.bat                      # 1-click launcher for Windows
├── run.sh                       # 1-click launcher for Linux / macOS
├── serve.py                     # Cross-platform local web server
├── README.md                    # Project documentation & presentation guide
│
└── sample_data/                 # Ready-to-use sample CSV files
    ├── sales_data.csv
    ├── student_performance.csv
    └── employee_analytics.csv
```
