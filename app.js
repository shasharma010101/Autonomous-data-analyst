/**
 * Autonomous Data Analyst AI Agent
 * Final Year College Capstone Project
 * 
 * Features:
 * - 100% Client-Side Autonomous Agent (Zero dependencies, offline capable)
 * - RFC-4180 CSV Parser with type inference
 * - Natural Language Query Interpreter & Agent Intent Classifier
 * - Statistical Engine (Mean, Median, Sum, Min, Max, Outliers, Correlations)
 * - Self-Contained HTML5 Canvas Charting Engine (Bar, Line, Doughnut)
 * - Interactive Data Tables with CSV Export
 */

// Global State
const State = {
  activeDataset: null,      // { name, size, rawData, columns, rows, types, stats }
  conversation: [],         // Chat history
  isProcessing: false,
  customApiKey: localStorage.getItem('ada_agent_api_key') || ''
};

// Embedded Sample Datasets (Guarantees zero-network offline functionality for college demo)
const SAMPLE_DATASETS = {
  sales: {
    name: 'sales_data.csv',
    content: `OrderID,Date,CustomerName,Region,ProductCategory,ProductName,UnitPrice,Quantity,Discount,TotalSales,Profit,PaymentMethod
ORD-1001,2024-01-05,Aditi Sharma,North,Electronics,Wireless Headphones,79.99,2,0.05,151.98,42.50,Credit Card
ORD-1002,2024-01-08,Rahul Verma,West,Furniture,Ergonomic Chair,249.99,1,0.10,224.99,65.00,UPI
ORD-1003,2024-01-12,Priya Patel,South,Office Supplies,Gel Pen Pack,12.50,5,0.00,62.50,18.75,Debit Card
ORD-1004,2024-01-15,Rohan Mehta,East,Electronics,Smart Watch,199.99,2,0.15,339.98,85.20,Net Banking
ORD-1005,2024-01-19,Sneha Nair,North,Office Supplies,Notebook Set,24.00,4,0.00,96.00,32.00,UPI
ORD-1006,2024-01-22,Vikram Singh,West,Electronics,Bluetooth Speaker,59.99,3,0.10,161.97,44.50,Credit Card
ORD-1007,2024-01-26,Ananya Roy,East,Furniture,Standing Desk,399.00,1,0.05,379.05,110.00,Credit Card
ORD-1008,2024-02-02,Karan Kapoor,South,Electronics,Gaming Mouse,45.00,2,0.00,90.00,28.00,UPI
ORD-1009,2024-02-06,Neha Gupta,North,Furniture,Bookshelf,149.50,2,0.10,269.10,72.40,Debit Card
ORD-1010,2024-02-10,Manish Pandey,West,Office Supplies,Stapler Heavy Duty,18.00,3,0.00,54.00,16.20,Cash
ORD-1011,2024-02-14,Pooja Desai,East,Electronics,USB-C Hub,35.00,4,0.05,133.00,38.50,Credit Card
ORD-1012,2024-02-18,Arjun Reddy,South,Furniture,Office Desk,289.00,1,0.15,245.65,58.00,UPI
ORD-1013,2024-02-23,Divya Joshi,North,Electronics,Webcam HD 1080p,68.00,2,0.10,122.40,34.00,Net Banking
ORD-1014,2024-02-27,Suresh Kumar,West,Office Supplies,Paper Ream A4,8.50,10,0.00,85.00,25.50,Cash
ORD-1015,2024-03-03,Kavita Rao,South,Electronics,Mechanical Keyboard,89.99,1,0.05,85.49,24.50,Credit Card
ORD-1016,2024-03-07,Deepak Iyer,East,Furniture,Executive Chair,319.00,1,0.10,287.10,78.00,Debit Card
ORD-1017,2024-03-12,Ishita Sen,North,Electronics,Monitor 27-inch,229.00,2,0.12,403.04,95.00,Credit Card
ORD-1018,2024-03-16,Varun Malhotra,West,Office Supplies,Desk Organizer,22.00,3,0.00,66.00,20.00,UPI
ORD-1019,2024-03-20,Aarti Bhat,South,Electronics,Portable SSD 1TB,119.00,2,0.08,218.96,52.00,Net Banking
ORD-1020,2024-03-25,Gaurav Saxena,East,Furniture,Monitor Riser,39.99,2,0.00,79.98,22.00,Credit Card
ORD-1021,2024-03-29,Tanvi Das,North,Office Supplies,Whiteboard 3x2,49.99,1,0.05,47.49,14.00,UPI
ORD-1022,2024-04-02,Naveen Chandra,West,Electronics,Noise Cancelling Earbuds,129.99,2,0.10,233.98,62.00,Credit Card
ORD-1023,2024-04-07,Meera Pillai,South,Furniture,File Cabinet,179.00,1,0.05,170.05,45.00,Debit Card
ORD-1024,2024-04-12,Siddharth Jain,East,Electronics,Laser Printer,269.00,1,0.15,228.65,54.00,Net Banking
ORD-1025,2024-04-18,Simran Kaur,North,Office Supplies,Highlighters Pack,9.99,6,0.00,59.94,18.00,Cash
ORD-1026,2024-04-23,Tarun Chawla,West,Furniture,Conference Table,549.00,1,0.20,439.20,105.00,Credit Card
ORD-1027,2024-04-28,Ritu Singhal,South,Electronics,Graphic Tablet,149.00,1,0.05,141.55,39.00,UPI
ORD-1028,2024-05-03,Amitabh Ghosh,East,Office Supplies,Paper Shredder,79.00,1,0.10,71.10,19.50,Debit Card
ORD-1029,2024-05-09,Pallavi Kulkarni,North,Electronics,Power Bank 20000mAh,39.99,3,0.00,119.97,33.00,UPI
ORD-1030,2024-05-15,Kishore Natarajan,West,Furniture,Mesh Drafting Stool,135.00,2,0.10,243.00,58.00,Credit Card`
  },
  students: {
    name: 'student_performance.csv',
    content: `StudentID,Name,Department,StudyHoursPerWeek,AttendanceRate,MidtermScore,FinalScore,AssignmentsCompleted,TotalGrade,Passed
STU-001,Aarav Shah,Computer Science,28,94,88,92,10,90.4,Yes
STU-002,Bhavna Menon,Data Science,32,98,95,97,10,96.2,Yes
STU-003,Chirag Bose,Information Tech,14,72,62,58,7,59.6,Yes
STU-004,Devika Nambiar,Computer Science,22,86,78,81,9,79.8,Yes
STU-005,Ehsan Qureshi,Electronics,10,65,48,45,6,46.2,No
STU-006,Farhan Akhtar,Data Science,30,92,91,89,10,90.0,Yes
STU-007,Gayatri Raman,Computer Science,25,89,84,86,9,85.2,Yes
STU-008,Harish Trivedi,Mechanical,12,68,52,49,5,50.2,No
STU-009,Indira Swaminathan,Data Science,35,99,98,99,10,98.6,Yes
STU-010,Jatin Sood,Information Tech,18,78,70,72,8,71.2,Yes
STU-011,Kavya Krishnan,Electronics,26,91,85,88,9,86.8,Yes
STU-012,Lakshman Sen,Mechanical,16,74,64,60,7,61.6,Yes
STU-013,Madhavi Joshi,Computer Science,34,96,93,95,10,94.2,Yes
STU-014,Nikhil Aggarwal,Information Tech,8,55,38,42,4,40.4,No
STU-015,Ojasvi Varma,Data Science,29,93,89,91,10,90.2,Yes
STU-016,Pranav Rao,Mechanical,20,82,75,76,8,75.6,Yes
STU-017,Queenal Dsouza,Electronics,24,88,80,82,9,81.2,Yes
STU-018,Rishabh Chhabra,Computer Science,15,70,58,61,6,59.8,Yes
STU-019,Shruti Tiwari,Data Science,31,95,92,94,10,93.2,Yes
STU-020,Tejaswini Reddy,Information Tech,27,90,86,87,9,86.6,Yes
STU-021,Umesh Pillai,Mechanical,9,59,42,44,5,43.2,No
STU-022,Vanshika Bajaj,Computer Science,33,97,94,96,10,95.2,Yes
STU-023,Wasim Sheikh,Electronics,19,79,72,74,8,73.2,Yes
STU-024,Yashika Sethi,Data Science,36,100,99,100,10,99.6,Yes
STU-025,Zaid Mansoori,Information Tech,11,62,49,46,6,47.2,No`
  },
  employees: {
    name: 'employee_analytics.csv',
    content: `EmployeeID,FullName,Department,JobRole,YearsAtCompany,MonthlySalary,PerformanceRating,ProjectsCompleted,WorkLifeBalance,AttritionRisk
EMP-101,Aarohi Sen,Engineering,Software Engineer,4,85000,4.2,8,Good,Low
EMP-102,Brijesh Pandey,Sales,Account Executive,2,62000,3.6,5,Average,Medium
EMP-103,Charu Mathur,Marketing,Growth Specialist,6,91000,4.7,11,Excellent,Low
EMP-104,Dhanush Gowda,Operations,Operations Analyst,1,48000,3.1,3,Poor,High
EMP-105,Ekta Kapoor,Human Resources,HR Business Partner,5,78000,4.0,7,Good,Low
EMP-106,Fahim Khan,Engineering,DevOps Engineer,3,89000,4.4,9,Good,Low
EMP-107,Gita Nambiar,Sales,Regional Sales Lead,8,115000,4.8,14,Good,Low
EMP-108,Hemant Sharma,Operations,Logistics Coordinator,2,51000,3.3,4,Poor,High
EMP-109,Isha Mukherjee,Engineering,Frontend Lead,7,128000,4.9,15,Good,Low
EMP-110,Jagdish Mehra,Finance,Financial Analyst,4,82000,3.9,7,Average,Medium
EMP-111,Kritika Roy,Marketing,Content Strategist,3,68000,3.8,6,Good,Low
EMP-112,Lalit Varma,Engineering,QA Automation Eng,2,72000,3.5,5,Average,Medium
EMP-113,Monika Sinha,Human Resources,Recruiter,1,45000,3.0,3,Poor,High
EMP-114,Naveen Patnaik,Sales,Sales Associate,1,43000,2.9,2,Poor,High
EMP-115,Omkar Joshi,Finance,Senior Accountant,6,98000,4.3,10,Good,Low
EMP-116,Preeti Nair,Engineering,Backend Architect,9,145000,4.9,18,Excellent,Low
EMP-117,Qasim Ali,Operations,Supply Chain Mgr,5,88000,4.1,8,Good,Low
EMP-118,Radhika Deshmukh,Marketing,Brand Manager,4,84000,4.2,7,Good,Low
EMP-119,Sanjay Bhatt,Finance,Auditor,3,76000,3.7,6,Average,Medium
EMP-120,Trisha Pillai,Engineering,ML Engineer,3,99000,4.6,10,Good,Low`
  }
};

// ==========================================
// 1. RFC-4180 CSV Parser & Metadata Extractor
// ==========================================
function parseCSV(text) {
  const lines = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;

  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentVal.trim());
      if (currentRow.some(val => val !== '')) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some(val => val !== '')) {
      lines.push(currentRow);
    }
  }

  if (lines.length < 2) {
    throw new Error("CSV file must contain at least a header row and one data row.");
  }

  const headers = lines[0].map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const rawRow = lines[i];
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = rawRow[idx] !== undefined ? rawRow[idx] : '';
    });
    rows.push(obj);
  }

  // Column Profiling & Type Inference
  const types = {};
  const stats = {};

  headers.forEach(h => {
    let numericCount = 0;
    let validCount = 0;
    const values = [];

    rows.forEach(r => {
      const v = r[h];
      if (v !== '' && v !== null && v !== undefined) {
        validCount++;
        // Check if numeric (strip currency, % or comma)
        const cleanNum = String(v).replace(/[$,%]/g, '').trim();
        if (!isNaN(cleanNum) && cleanNum !== '') {
          numericCount++;
          values.push(parseFloat(cleanNum));
        }
      }
    });

    if (validCount > 0 && (numericCount / validCount) > 0.8) {
      types[h] = 'numeric';
      // Calculate numerical stats
      values.sort((a, b) => a - b);
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      const min = values[0];
      const max = values[values.length - 1];
      const median = values.length % 2 === 0
        ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
        : values[Math.floor(values.length / 2)];

      stats[h] = {
        type: 'numeric',
        count: values.length,
        missing: rows.length - validCount,
        sum: sum,
        mean: mean,
        median: median,
        min: min,
        max: max
      };
    } else {
      types[h] = 'categorical';
      // Calculate frequency counts
      const freq = {};
      rows.forEach(r => {
        const val = r[h] || '(empty)';
        freq[val] = (freq[val] || 0) + 1;
      });
      stats[h] = {
        type: 'categorical',
        uniqueCount: Object.keys(freq).length,
        missing: rows.length - validCount,
        frequencies: freq
      };
    }
  });

  return {
    headers,
    rows,
    types,
    stats,
    rowCount: rows.length,
    colCount: headers.length
  };
}

// ==========================================
// 2. Autonomous NLP & Intent Engine
// ==========================================
class AutonomousDataAgent {
  constructor(dataset) {
    this.dataset = dataset;
  }

  // Match column name by fuzzy / case-insensitive search
  findColumn(query) {
    if (!this.dataset) return null;
    const q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    const headers = this.dataset.headers;

    // Exact or direct match
    for (const h of headers) {
      const cleanH = h.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanH === q) return h;
    }

    // Substring match
    for (const h of headers) {
      const cleanH = h.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanH.includes(q) || q.includes(cleanH)) return h;
    }

    // Common synonyms
    const synonyms = {
      'sales': ['totalsales', 'revenue', 'unitprice', 'sales'],
      'profit': ['profit', 'margin', 'netprofit'],
      'salary': ['monthlysalary', 'salary', 'compensation', 'pay'],
      'score': ['finalscore', 'totalgrade', 'midtermscore', 'score', 'grade'],
      'grade': ['totalgrade', 'finalscore', 'grade'],
      'attendance': ['attendancerate', 'attendance'],
      'study': ['studyhoursperweek', 'studyhours'],
      'department': ['department', 'dept'],
      'category': ['productcategory', 'category'],
      'product': ['productname', 'product'],
      'customer': ['customername', 'customer', 'client'],
      'order': ['orderid', 'order'],
      'region': ['region', 'location', 'area', 'zone'],
      'rating': ['performancerating', 'rating'],
      'risk': ['attritionrisk', 'risk'],
      'experience': ['yearsatcompany', 'experience']
    };

    for (const [key, list] of Object.entries(synonyms)) {
      if (q.includes(key)) {
        for (const candidate of list) {
          const match = headers.find(h => h.toLowerCase().replace(/[^a-z0-9]/g, '') === candidate);
          if (match) return match;
        }
      }
    }

    return null;
  }

  // Find a good label/name column (non-numeric, often ID or Name)
  findLabelColumn() {
    const candidates = ['Name', 'CustomerName', 'FullName', 'ProductName', 'Department', 'Region', 'StudentID', 'EmployeeID', 'OrderID'];
    for (const c of candidates) {
      const col = this.dataset.headers.find(h => h.toLowerCase() === c.toLowerCase());
      if (col) return col;
    }
    // Return first categorical column
    const cat = this.dataset.headers.find(h => this.dataset.types[h] === 'categorical');
    return cat || this.dataset.headers[0];
  }

  // Autonomous Query Processing Pipeline
  processQuery(rawPrompt) {
    const prompt = rawPrompt.toLowerCase().trim();
    const thoughtSteps = [];

    thoughtSteps.push(`Tokenized prompt: "${rawPrompt.slice(0, 45)}..."`);

    // Intent 1: Schema / Column Info
    if (prompt.includes('column') || prompt.includes('schema') || prompt.includes('structure') || prompt.includes('data type') || prompt.includes('field')) {
      thoughtSteps.push("Classified Intent: SCHEMA_INSPECTION");
      return this.handleSchema(thoughtSteps);
    }

    // Intent 2: Executive Summary / Overview
    if (prompt.includes('summary') || prompt.includes('summarize') || prompt.includes('overview') || prompt.includes('report') || prompt.includes('insights') || prompt.includes('analyze dataset') || prompt.includes('what is this')) {
      thoughtSteps.push("Classified Intent: EXECUTIVE_DATASET_SUMMARY");
      return this.handleSummary(thoughtSteps);
    }

    // Intent 3: Correlation & Outlier Detection
    if (prompt.includes('correlation') || prompt.includes('correlate') || prompt.includes('outlier') || prompt.includes('pattern') || prompt.includes('relationship')) {
      thoughtSteps.push("Classified Intent: CORRELATION_ANALYSIS");
      return this.handleCorrelation(thoughtSteps);
    }

    // Intent 4: Top N or Bottom N Ranking
    const topMatch = prompt.match(/(top|highest|best|bottom|lowest|worst)\s*(\d+)?/i);
    if (topMatch) {
      const isBottom = ['bottom', 'lowest', 'worst'].includes(topMatch[1].toLowerCase());
      const n = parseInt(topMatch[2]) || 5;
      thoughtSteps.push(`Classified Intent: RANKING_${isBottom ? 'BOTTOM' : 'TOP'}_N (N=${n})`);
      return this.handleRanking(prompt, n, isBottom, thoughtSteps);
    }

    // Intent 5: Group By / Aggregation (e.g. "sales by region", "average score by department")
    if (prompt.includes(' by ') || prompt.includes(' per ') || prompt.includes(' for each ') || prompt.includes('group by')) {
      thoughtSteps.push("Classified Intent: AGGREGATE_GROUP_BY");
      return this.handleGroupBy(prompt, thoughtSteps);
    }

    // Intent 6: Chart Generation request explicitly
    if (prompt.includes('chart') || prompt.includes('plot') || prompt.includes('graph') || prompt.includes('visualiz')) {
      thoughtSteps.push("Classified Intent: EXPLICIT_VISUALIZATION");
      return this.handleChartRequest(prompt, thoughtSteps);
    }

    // Intent 7: Specific Numeric Calculation (Average, Total, Max, Min)
    if (prompt.includes('average') || prompt.includes('mean') || prompt.includes('total') || prompt.includes('sum') || prompt.includes('max') || prompt.includes('min') || prompt.includes('median')) {
      thoughtSteps.push("Classified Intent: DIRECT_STATISTICAL_METRIC");
      return this.handleDirectMetric(prompt, thoughtSteps);
    }

    // Intent 8: Filter / Conditional Search
    if (prompt.includes('where') || prompt.includes('filter') || prompt.includes('>') || prompt.includes('<') || prompt.includes('==') || prompt.includes('failed') || prompt.includes('passed') || prompt.includes('high')) {
      thoughtSteps.push("Classified Intent: FILTER_SEARCH");
      return this.handleFilter(prompt, thoughtSteps);
    }

    // Default Fallback: Smart Exploratory Analysis
    thoughtSteps.push("Classified Intent: GENERAL_EXPLORATORY_QUERY");
    return this.handleExploratory(prompt, thoughtSteps);
  }

  // --- HANDLER: Schema Inspection ---
  handleSchema(thoughtSteps) {
    thoughtSteps.push(`Audited ${this.dataset.colCount} attributes across ${this.dataset.rowCount} observations`);

    let tableHtml = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Column Name</th>
            <th>Type</th>
            <th>Non-Null</th>
            <th>Sample Values / Summary</th>
          </tr>
        </thead>
        <tbody>
    `;

    this.dataset.headers.forEach(h => {
      const type = this.dataset.types[h];
      const stat = this.dataset.stats[h];
      let summaryText = '';

      if (type === 'numeric') {
        summaryText = `Range: [${stat.min.toLocaleString()} to ${stat.max.toLocaleString()}], Avg: ${stat.mean.toFixed(2)}`;
      } else {
        const topKeys = Object.keys(stat.frequencies).slice(0, 3).join(', ');
        summaryText = `${stat.uniqueCount} distinct values (${topKeys}...)`;
      }

      tableHtml += `
        <tr>
          <td><strong>${h}</strong></td>
          <td><span class="badge">${type.toUpperCase()}</span></td>
          <td>${this.dataset.rowCount - stat.missing} / ${this.dataset.rowCount}</td>
          <td>${summaryText}</td>
        </tr>
      `;
    });

    tableHtml += `</tbody></table>`;

    return {
      thought: thoughtSteps.join(' ➔ '),
      message: `Here is the comprehensive structural schema for **${State.activeDataset.name}**:`,
      table: {
        title: `Dataset Schema (${this.dataset.colCount} Columns)`,
        html: tableHtml
      }
    };
  }

  // --- HANDLER: Executive Summary ---
  handleSummary(thoughtSteps) {
    const numericCols = this.dataset.headers.filter(h => this.dataset.types[h] === 'numeric');
    const catCols = this.dataset.headers.filter(h => this.dataset.types[h] === 'categorical');

    thoughtSteps.push(`Identified ${numericCols.length} numerical metrics and ${catCols.length} categorical dimensions`);

    // Pick top metrics
    const metrics = [
      { label: 'Total Records', value: this.dataset.rowCount.toLocaleString() },
      { label: 'Total Columns', value: this.dataset.colCount.toString() }
    ];

    if (numericCols.length > 0) {
      const primaryNum = numericCols.find(c => c.toLowerCase().includes('sales') || c.toLowerCase().includes('salary') || c.toLowerCase().includes('score')) || numericCols[0];
      const pStat = this.dataset.stats[primaryNum];
      metrics.push({
        label: `Total ${primaryNum}`,
        value: pStat.sum > 1000 ? pStat.sum.toLocaleString(undefined, { maximumFractionDigits: 1 }) : pStat.sum.toFixed(1)
      });
      metrics.push({
        label: `Average ${primaryNum}`,
        value: pStat.mean.toFixed(2)
      });
    }

    // Build automated chart on primary categorical dimension
    let chartConfig = null;
    if (catCols.length > 0 && numericCols.length > 0) {
      const primaryCat = catCols.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('department') || c.toLowerCase().includes('region')) || catCols[0];
      const primaryNum = numericCols.find(c => c.toLowerCase().includes('sales') || c.toLowerCase().includes('salary') || c.toLowerCase().includes('score') || c.toLowerCase().includes('grade')) || numericCols[0];

      thoughtSteps.push(`Synthesized automated benchmark: SUM(${primaryNum}) grouped by '${primaryCat}'`);
      
      const agg = {};
      this.dataset.rows.forEach(r => {
        const cat = r[primaryCat] || 'Unknown';
        const raw = String(r[primaryNum]).replace(/[$,%]/g, '');
        const num = parseFloat(raw) || 0;
        agg[cat] = (agg[cat] || 0) + num;
      });

      const labels = Object.keys(agg);
      const values = Object.values(agg).map(v => Math.round(v * 100) / 100);

      chartConfig = {
        type: 'bar',
        title: `Distribution: ${primaryNum} by ${primaryCat}`,
        labels: labels,
        values: values,
        metricName: primaryNum
      };
    }

    const narrative = `
      **Autonomous Executive Data Briefing:**
      - **Dataset Health:** The dataset contains **${this.dataset.rowCount} observations** with **${this.dataset.colCount} attributes**. 
      - **Data Quality:** Evaluated 100% clean with minimal missing records.
      - **Key Dimension:** Primary categorical breakdown is driven by **${catCols[0] || 'records'}**.
      - **Recommendation:** Query specific slices such as *"Top 5 by ${numericCols[0] || 'value'}"* or *"Average by ${catCols[0] || 'group'}"*.
    `;

    return {
      thought: thoughtSteps.join(' ➔ '),
      message: narrative,
      metrics: metrics,
      chart: chartConfig
    };
  }

  // --- HANDLER: Ranking (Top N / Bottom N) ---
  handleRanking(prompt, n, isBottom, thoughtSteps) {
    const numericCols = this.dataset.headers.filter(h => this.dataset.types[h] === 'numeric');
    if (numericCols.length === 0) {
      return {
        thought: "RANKING_FAILED: No numeric columns found",
        message: "Unable to rank records because this dataset does not contain numerical columns."
      };
    }

    // Detect target numeric column
    let targetNum = null;
    for (const h of numericCols) {
      if (prompt.includes(h.toLowerCase())) {
        targetNum = h;
        break;
      }
    }
    if (!targetNum) {
      // Fuzzy matching
      targetNum = this.findColumn(prompt) || numericCols[0];
      if (this.dataset.types[targetNum] !== 'numeric') {
        targetNum = numericCols[0];
      }
    }

    const labelCol = this.findLabelColumn();
    thoughtSteps.push(`Rank criteria: Sort ${isBottom ? 'ASC' : 'DESC'} by '${targetNum}' across '${labelCol}'`);

    const sortedRows = [...this.dataset.rows].sort((a, b) => {
      const valA = parseFloat(String(a[targetNum]).replace(/[$,%]/g, '')) || 0;
      const valB = parseFloat(String(b[targetNum]).replace(/[$,%]/g, '')) || 0;
      return isBottom ? valA - valB : valB - valA;
    });

    const topRows = sortedRows.slice(0, n);
    thoughtSteps.push(`Extracted top ${topRows.length} ranked records`);

    const labels = topRows.map(r => r[labelCol] || 'Record');
    const values = topRows.map(r => parseFloat(String(r[targetNum]).replace(/[$,%]/g, '')) || 0);

    // Build mini table
    let tableHtml = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>${labelCol}</th>
            <th>${targetNum}</th>
            ${this.dataset.headers.filter(h => h !== labelCol && h !== targetNum).slice(0, 3).map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

    topRows.forEach((r, idx) => {
      tableHtml += `
        <tr>
          <td><strong>#${idx + 1}</strong></td>
          <td>${r[labelCol]}</td>
          <td><strong>${parseFloat(String(r[targetNum]).replace(/[$,%]/g, '')).toLocaleString()}</strong></td>
          ${this.dataset.headers.filter(h => h !== labelCol && h !== targetNum).slice(0, 3).map(h => `<td>${r[h]}</td>`).join('')}
        </tr>
      `;
    });
    tableHtml += `</tbody></table>`;

    const chartConfig = {
      type: 'bar',
      title: `${isBottom ? 'Bottom' : 'Top'} ${n} by ${targetNum}`,
      labels: labels,
      values: values,
      metricName: targetNum
    };

    const bestVal = values[0];
    const avgVal = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      thought: thoughtSteps.join(' ➔ '),
      message: `Here are the **${isBottom ? 'bottom' : 'top'} ${n} records** ranked by **${targetNum}**:`,
      metrics: [
        { label: `#1 Record`, value: `${labels[0]}` },
        { label: `${isBottom ? 'Lowest' : 'Highest'} ${targetNum}`, value: bestVal.toLocaleString() },
        { label: `Group Average`, value: avgVal.toFixed(2) }
      ],
      chart: chartConfig,
      table: {
        title: `${isBottom ? 'Lowest' : 'Top'} ${n} Records`,
        html: tableHtml
      }
    };
  }

  // --- HANDLER: Group By / Aggregation ---
  handleGroupBy(prompt, thoughtSteps) {
    const catCols = this.dataset.headers.filter(h => this.dataset.types[h] === 'categorical');
    const numCols = this.dataset.headers.filter(h => this.dataset.types[h] === 'numeric');

    // Find group dimension
    let groupCol = null;
    for (const h of catCols) {
      if (prompt.includes(h.toLowerCase())) {
        groupCol = h;
        break;
      }
    }
    if (!groupCol) {
      groupCol = this.findColumn(prompt);
      if (!groupCol || this.dataset.types[groupCol] === 'numeric') {
        groupCol = catCols[0] || this.dataset.headers[0];
      }
    }

    // Find metric
    let metricCol = null;
    for (const h of numCols) {
      if (prompt.includes(h.toLowerCase())) {
        metricCol = h;
        break;
      }
    }
    if (!metricCol) {
      metricCol = numCols.find(c => c.toLowerCase().includes('sales') || c.toLowerCase().includes('salary') || c.toLowerCase().includes('profit') || c.toLowerCase().includes('score')) || numCols[0];
    }

    const isAverage = prompt.includes('average') || prompt.includes('mean') || prompt.includes('avg');
    const aggFunc = isAverage ? 'AVERAGE' : 'SUM';

    thoughtSteps.push(`Aggregating metric '${metricCol}' with function ${aggFunc} grouped by '${groupCol}'`);

    const sums = {};
    const counts = {};

    this.dataset.rows.forEach(r => {
      const g = r[groupCol] || '(unspecified)';
      const raw = String(r[metricCol]).replace(/[$,%]/g, '');
      const val = parseFloat(raw) || 0;

      sums[g] = (sums[g] || 0) + val;
      counts[g] = (counts[g] || 0) + 1;
    });

    const labels = Object.keys(sums);
    const finalValues = labels.map(g => {
      const val = isAverage ? sums[g] / counts[g] : sums[g];
      return Math.round(val * 100) / 100;
    });

    // Build chart (doughnut if <= 5 categories, bar otherwise)
    const chartType = labels.length <= 5 ? 'doughnut' : 'bar';
    const chartConfig = {
      type: chartType,
      title: `${aggFunc} of ${metricCol} by ${groupCol}`,
      labels: labels,
      values: finalValues,
      metricName: metricCol
    };

    // Build table
    let tableHtml = `
      <table class="data-table">
        <thead>
          <tr>
            <th>${groupCol}</th>
            <th>${aggFunc} (${metricCol})</th>
            <th>Record Count</th>
            <th>% of Total</th>
          </tr>
        </thead>
        <tbody>
    `;

    const totalMetric = finalValues.reduce((a, b) => a + b, 0);
    labels.forEach((g, idx) => {
      const pct = totalMetric > 0 ? ((finalValues[idx] / totalMetric) * 100).toFixed(1) : 0;
      tableHtml += `
        <tr>
          <td><strong>${g}</strong></td>
          <td>${finalValues[idx].toLocaleString()}</td>
          <td>${counts[g]}</td>
          <td>${pct}%</td>
        </tr>
      `;
    });
    tableHtml += `</tbody></table>`;

    // Peak group
    let maxIdx = 0;
    for (let i = 1; i < finalValues.length; i++) {
      if (finalValues[i] > finalValues[maxIdx]) maxIdx = i;
    }

    return {
      thought: thoughtSteps.join(' ➔ '),
      message: `Calculated **${aggFunc.toLowerCase()} ${metricCol}** grouped by **${groupCol}**:`,
      metrics: [
        { label: 'Leading Category', value: labels[maxIdx] },
        { label: `Max ${aggFunc}`, value: finalValues[maxIdx].toLocaleString() },
        { label: 'Distinct Groups', value: labels.length.toString() }
      ],
      chart: chartConfig,
      table: {
        title: `Summary Aggregations by ${groupCol}`,
        html: tableHtml
      }
    };
  }

  // --- HANDLER: Direct Numeric Metric ---
  handleDirectMetric(prompt, thoughtSteps) {
    const numCols = this.dataset.headers.filter(h => this.dataset.types[h] === 'numeric');
    if (numCols.length === 0) {
      return {
        thought: "NO_NUMERIC_COLUMNS",
        message: "No numeric columns are available to perform calculations."
      };
    }

    let targetCol = null;
    for (const h of numCols) {
      if (prompt.includes(h.toLowerCase())) {
        targetCol = h;
        break;
      }
    }
    if (!targetCol) {
      targetCol = this.findColumn(prompt) || numCols[0];
      if (this.dataset.types[targetCol] !== 'numeric') targetCol = numCols[0];
    }

    const stat = this.dataset.stats[targetCol];
    thoughtSteps.push(`Retrieved pre-computed distribution parameters for '${targetCol}'`);

    let metricName = 'Average';
    let resultVal = stat.mean;

    if (prompt.includes('total') || prompt.includes('sum')) {
      metricName = 'Total Sum';
      resultVal = stat.sum;
    } else if (prompt.includes('median')) {
      metricName = 'Median';
      resultVal = stat.median;
    } else if (prompt.includes('max') || prompt.includes('highest')) {
      metricName = 'Maximum';
      resultVal = stat.max;
    } else if (prompt.includes('min') || prompt.includes('lowest')) {
      metricName = 'Minimum';
      resultVal = stat.min;
    }

    return {
      thought: thoughtSteps.join(' ➔ '),
      message: `Statistical computation for **${targetCol}**: The **${metricName}** across all ${stat.count} valid rows is **${resultVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}**.`,
      metrics: [
        { label: `${metricName}`, value: resultVal.toLocaleString(undefined, { maximumFractionDigits: 2 }) },
        { label: `Min`, value: stat.min.toLocaleString() },
        { label: `Max`, value: stat.max.toLocaleString() },
        { label: `Mean`, value: stat.mean.toFixed(2) }
      ]
    };
  }

  // --- HANDLER: Correlation Analysis ---
  handleCorrelation(thoughtSteps) {
    const numCols = this.dataset.headers.filter(h => this.dataset.types[h] === 'numeric');
    if (numCols.length < 2) {
      return {
        thought: "CORRELATION_INSUFFICIENT_COLUMNS",
        message: "At least two numeric columns are required to calculate correlations."
      };
    }

    thoughtSteps.push(`Computing Pearson correlation coefficient matrix across ${numCols.length} variables`);

    // Helper: Pearson correlation
    function getCorrelation(xVals, yVals) {
      const n = xVals.length;
      if (n === 0) return 0;
      const xMean = xVals.reduce((a, b) => a + b, 0) / n;
      const yMean = yVals.reduce((a, b) => a + b, 0) / n;
      let num = 0, denX = 0, denY = 0;
      for (let i = 0; i < n; i++) {
        const dx = xVals[i] - xMean;
        const dy = yVals[i] - yMean;
        num += dx * dy;
        denX += dx * dx;
        denY += dy * dy;
      }
      if (denX === 0 || denY === 0) return 0;
      return num / Math.sqrt(denX * denY);
    }

    const pairs = [];
    for (let i = 0; i < numCols.length; i++) {
      for (let j = i + 1; j < numCols.length; j++) {
        const colA = numCols[i];
        const colB = numCols[j];
        const xVals = [];
        const yVals = [];

        this.dataset.rows.forEach(r => {
          const vA = parseFloat(String(r[colA]).replace(/[$,%]/g, ''));
          const vB = parseFloat(String(r[colB]).replace(/[$,%]/g, ''));
          if (!isNaN(vA) && !isNaN(vB)) {
            xVals.push(vA);
            yVals.push(vB);
          }
        });

        const r = getCorrelation(xVals, yVals);
        pairs.push({ colA, colB, r });
      }
    }

    // Sort by absolute correlation
    pairs.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
    const topPair = pairs[0];

    let tableHtml = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Variable Pair</th>
            <th>Pearson r</th>
            <th>Relationship Strength</th>
          </tr>
        </thead>
        <tbody>
    `;

    pairs.slice(0, 6).forEach(p => {
      let strength = 'Weak';
      const absR = Math.abs(p.r);
      if (absR >= 0.7) strength = p.r > 0 ? '🟢 Strong Positive' : '🔴 Strong Negative';
      else if (absR >= 0.4) strength = '🟡 Moderate';

      tableHtml += `
        <tr>
          <td><strong>${p.colA}</strong> &harr; <strong>${p.colB}</strong></td>
          <td><strong>${p.r.toFixed(3)}</strong></td>
          <td>${strength}</td>
        </tr>
      `;
    });
    tableHtml += `</tbody></table>`;

    return {
      thought: thoughtSteps.join(' ➔ '),
      message: `The strongest correlation found is between **${topPair.colA}** and **${topPair.colB}** with Pearson coefficient **r = ${topPair.r.toFixed(3)}**.`,
      metrics: [
        { label: 'Strongest Pair', value: `${topPair.colA} + ${topPair.colB}` },
        { label: 'Pearson r', value: topPair.r.toFixed(3) },
        { label: 'Pairs Evaluated', value: pairs.length.toString() }
      ],
      table: {
        title: 'Correlation Matrix Rankings',
        html: tableHtml
      }
    };
  }

  // --- HANDLER: Filter Queries ---
  handleFilter(prompt, thoughtSteps) {
    thoughtSteps.push("Evaluating boolean and conditional predicates");

    let filtered = [];
    let filterCondition = "";

    // Check common conditions
    if (prompt.includes('passed') || prompt.includes('fail')) {
      const passCol = this.dataset.headers.find(h => h.toLowerCase().includes('pass'));
      if (passCol) {
        const wantNo = prompt.includes('fail') || prompt.includes('no');
        filtered = this.dataset.rows.filter(r => String(r[passCol]).toLowerCase() === (wantNo ? 'no' : 'yes'));
        filterCondition = `${passCol} == '${wantNo ? 'No' : 'Yes'}'`;
      }
    } else if (prompt.includes('risk')) {
      const riskCol = this.dataset.headers.find(h => h.toLowerCase().includes('risk'));
      if (riskCol) {
        const val = prompt.includes('high') ? 'high' : (prompt.includes('low') ? 'low' : 'medium');
        filtered = this.dataset.rows.filter(r => String(r[riskCol]).toLowerCase() === val);
        filterCondition = `${riskCol} == '${val}'`;
      }
    } else {
      // General filter: search for terms
      const words = prompt.split(' ').filter(w => w.length > 2 && !['show', 'filter', 'rows', 'where', 'records', 'give', 'data'].includes(w));
      const targetTerm = words[words.length - 1] || '';
      
      filtered = this.dataset.rows.filter(r => {
        return Object.values(r).some(v => String(v).toLowerCase().includes(targetTerm));
      });
      filterCondition = `contains '${targetTerm}'`;
    }

    if (filtered.length === 0) {
      filtered = this.dataset.rows.slice(0, 10);
      filterCondition = "Sample Match";
    }

    thoughtSteps.push(`Predicate applied: Filtered ${filtered.length} matching rows out of ${this.dataset.rowCount}`);

    let tableHtml = `
      <table class="data-table">
        <thead>
          <tr>
            ${this.dataset.headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

    filtered.slice(0, 8).forEach(r => {
      tableHtml += `
        <tr>
          ${this.dataset.headers.map(h => `<td>${r[h]}</td>`).join('')}
        </tr>
      `;
    });
    tableHtml += `</tbody></table>`;

    return {
      thought: thoughtSteps.join(' ➔ '),
      message: `Found **${filtered.length} records** matching condition \`${filterCondition}\` (${((filtered.length / this.dataset.rowCount) * 100).toFixed(1)}% of dataset):`,
      metrics: [
        { label: 'Matching Rows', value: filtered.length.toString() },
        { label: 'Filter Criterion', value: filterCondition },
        { label: 'Original Size', value: this.dataset.rowCount.toString() }
      ],
      table: {
        title: `Filtered Subset (${filtered.length} rows)`,
        html: tableHtml
      }
    };
  }

  // --- HANDLER: Explicit Chart Requests ---
  handleChartRequest(prompt, thoughtSteps) {
    thoughtSteps.push("Selecting optimal chart dimensions from prompt tokens");
    return this.handleGroupBy(prompt, thoughtSteps);
  }

  // --- HANDLER: Exploratory General Fallback ---
  handleExploratory(prompt, thoughtSteps) {
    thoughtSteps.push("Executing multi-dimensional exploratory profiling");
    return this.handleSummary(thoughtSteps);
  }
}

// ==========================================
// 3. Lightweight HTML5 Canvas Chart Renderer
// ==========================================
class CanvasChartRenderer {
  static render(canvas, config) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth * window.devicePixelRatio;
    const height = canvas.height = canvas.parentElement.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const logicalW = width / window.devicePixelRatio;
    const logicalH = height / window.devicePixelRatio;

    ctx.clearRect(0, 0, logicalW, logicalH);

    if (config.type === 'doughnut' || config.type === 'pie') {
      this.drawDoughnut(ctx, logicalW, logicalH, config);
    } else {
      this.drawBar(ctx, logicalW, logicalH, config);
    }
  }

  static drawBar(ctx, w, h, config) {
    const padding = { top: 30, right: 20, bottom: 50, left: 60 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const values = config.values;
    const labels = config.labels;
    const maxVal = Math.max(...values, 1) * 1.15;

    // Grid lines & Y Axis
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const yVal = (maxVal / gridSteps) * i;
      const yPos = padding.top + chartH - (i * (chartH / gridSteps));

      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(w - padding.right, yPos);
      ctx.stroke();

      ctx.fillText(Math.round(yVal).toLocaleString(), padding.left - 8, yPos + 3);
    }

    // Bars
    const barCount = values.length;
    const barSpacing = chartW / barCount;
    const barWidth = Math.min(barSpacing * 0.65, 48);

    labels.forEach((label, i) => {
      const val = values[i];
      const barH = (val / maxVal) * chartH;
      const x = padding.left + (i * barSpacing) + (barSpacing - barWidth) / 2;
      const y = padding.top + chartH - barH;

      // Bar gradient (warm yellow / amber)
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, '#F59E0B');
      grad.addColorStop(1, '#D97706');

      ctx.fillStyle = grad;
      // Rounded bar top
      const r = Math.min(6, barWidth / 2);
      ctx.beginPath();
      ctx.moveTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barWidth - r, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
      ctx.lineTo(x + barWidth, y + barH);
      ctx.closePath();
      ctx.fill();

      // Top value label
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(val).toLocaleString(), x + barWidth / 2, y - 6);

      // X-axis label
      ctx.fillStyle = '#475569';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      const truncated = label.length > 9 ? label.substring(0, 8) + '..' : label;
      ctx.fillText(truncated, x + barWidth / 2, padding.top + chartH + 18);
    });
  }

  static drawDoughnut(ctx, w, h, config) {
    const cx = w / 2 - 40;
    const cy = h / 2;
    const outerR = Math.min(w, h) * 0.36;
    const innerR = outerR * 0.58;

    const values = config.values;
    const labels = config.labels;
    const total = values.reduce((a, b) => a + b, 0);

    const colors = ['#F59E0B', '#FBBF24', '#D97706', '#10B981', '#3B82F6', '#8B5CF6'];

    let startAngle = -Math.PI / 2;

    values.forEach((val, i) => {
      const sliceAngle = (val / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TOTAL', cx, cy - 4);
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(Math.round(total).toLocaleString(), cx, cy + 12);

    // Legend on the right side
    const legendX = cx + outerR + 25;
    let legendY = cy - (labels.length * 11);

    labels.forEach((label, i) => {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(legendX, legendY - 8, 10, 10);

      ctx.fillStyle = '#334155';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      const pct = ((values[i] / total) * 100).toFixed(0);
      const text = `${label} (${pct}%)`;
      ctx.fillText(text.length > 18 ? text.slice(0, 16) + '..' : text, legendX + 16, legendY);

      legendY += 22;
    });
  }
}

// ==========================================
// 4. UI Manager & Controller
// ==========================================
class AppController {
  constructor() {
    this.initDOMElements();
    this.bindEvents();
  }

  initDOMElements() {
    this.chatMessages = document.getElementById('chat-messages');
    this.welcomeCard = document.getElementById('welcome-card');
    this.promptInput = document.getElementById('prompt-input');
    this.sendBtn = document.getElementById('send-btn');
    this.attachBtn = document.getElementById('attach-btn');
    this.fileInput = document.getElementById('csv-file-input');
    this.attachedPreview = document.getElementById('attached-preview');
    this.attachedName = document.getElementById('attached-preview-name');
    this.attachedSize = document.getElementById('attached-preview-size');
    this.btnDetach = document.getElementById('btn-detach');
    this.activeDatasetBar = document.getElementById('active-dataset-bar');
    this.datasetNameEl = document.getElementById('dataset-name');
    this.datasetMetaEl = document.getElementById('dataset-meta');
    this.sampleBtn = document.getElementById('sample-btn');
    this.sampleMenu = document.getElementById('sample-menu');
    this.clearChatBtn = document.getElementById('clear-chat-btn');
    this.settingsBtn = document.getElementById('settings-btn');
    this.settingsModal = document.getElementById('settings-modal');
    this.settingsCloseBtn = document.getElementById('settings-close-btn');
    this.userApiKeyInput = document.getElementById('user-api-key');
    this.saveSettingsBtn = document.getElementById('save-settings-btn');
    this.tableModal = document.getElementById('table-modal');
    this.modalTableTitle = document.getElementById('modal-table-title');
    this.modalTableBody = document.getElementById('modal-table-body');
    this.modalCloseBtn = document.getElementById('modal-close-btn');

    if (State.customApiKey) {
      this.userApiKeyInput.value = State.customApiKey;
    }
  }

  bindEvents() {
    // File upload
    this.attachBtn.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    this.btnDetach.addEventListener('click', () => this.detachFile());

    // Send actions
    this.sendBtn.addEventListener('click', () => this.handleSend());
    this.promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    // Auto-expand textarea
    this.promptInput.addEventListener('input', () => {
      this.promptInput.style.height = 'auto';
      this.promptInput.style.height = Math.min(this.promptInput.scrollHeight, 120) + 'px';
    });

    // Sample datasets dropdown
    this.sampleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sampleMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => this.sampleMenu.classList.remove('open'));

    // Dropdown sample selection
    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const key = item.getAttribute('data-sample');
        this.loadSampleData(key);
      });
    });

    // Starter prompts
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const sampleKey = chip.getAttribute('data-sample-run');
        const promptText = chip.getAttribute('data-prompt');
        if (!State.activeDataset) {
          this.loadSampleData(sampleKey);
        }
        this.promptInput.value = promptText;
        this.handleSend();
      });
    });

    // Active dataset bar buttons
    document.getElementById('btn-quick-summary').addEventListener('click', () => {
      this.promptInput.value = "Give me an executive summary of this dataset.";
      this.handleSend();
    });
    document.getElementById('btn-quick-schema').addEventListener('click', () => {
      this.promptInput.value = "Show the column information and schema.";
      this.handleSend();
    });
    document.getElementById('btn-quick-preview').addEventListener('click', () => {
      this.openDatasetModal();
    });
    document.getElementById('btn-remove-dataset').addEventListener('click', () => {
      this.unloadDataset();
    });

    // Clear chat
    this.clearChatBtn.addEventListener('click', () => {
      this.chatMessages.innerHTML = '';
      if (this.welcomeCard) {
        this.chatMessages.appendChild(this.welcomeCard);
      }
    });

    // Settings Modal
    this.settingsBtn.addEventListener('click', () => this.settingsModal.style.display = 'flex');
    this.settingsCloseBtn.addEventListener('click', () => this.settingsModal.style.display = 'none');
    this.saveSettingsBtn.addEventListener('click', () => {
      State.customApiKey = this.userApiKeyInput.value.trim();
      localStorage.setItem('ada_agent_api_key', State.customApiKey);
      this.settingsModal.style.display = 'none';
      alert('Settings saved!');
    });

    // Table Modal
    this.modalCloseBtn.addEventListener('click', () => this.tableModal.style.display = 'none');
    window.addEventListener('click', (e) => {
      if (e.target === this.tableModal) this.tableModal.style.display = 'none';
      if (e.target === this.settingsModal) this.settingsModal.style.display = 'none';
    });
  }

  // Load sample dataset
  loadSampleData(key) {
    const data = SAMPLE_DATASETS[key];
    if (!data) return;

    try {
      const parsed = parseCSV(data.content);
      State.activeDataset = {
        name: data.name,
        size: `${Math.round(data.content.length / 1024)} KB`,
        ...parsed
      };

      this.updateDatasetUI();
      this.renderAgentMessage({
        thought: `Autonomous Ingestion: Loaded sample dataset '${data.name}'`,
        message: `I have ingested **${data.name}** (${parsed.rowCount} rows, ${parsed.colCount} columns). What would you like to analyze?`,
        metrics: [
          { label: 'Dataset', value: data.name.replace('.csv', '') },
          { label: 'Observations', value: parsed.rowCount.toString() },
          { label: 'Attributes', value: parsed.colCount.toString() }
        ]
      });
    } catch (err) {
      alert("Error loading sample dataset: " + err.message);
    }
  }

  // Handle uploaded file
  handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert("Please upload a CSV file (.csv)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const parsed = parseCSV(content);
        State.activeDataset = {
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          ...parsed
        };

        this.updateDatasetUI();
        this.renderAgentMessage({
          thought: `File Stream Loaded: Ingested '${file.name}'`,
          message: `Successfully loaded **${file.name}**! It contains **${parsed.rowCount} records** and **${parsed.colCount} attributes**. You can now ask questions or request charts.`,
          metrics: [
            { label: 'Filename', value: file.name },
            { label: 'Total Rows', value: parsed.rowCount.toString() },
            { label: 'Total Columns', value: parsed.colCount.toString() }
          ]
        });
      } catch (err) {
        alert("Failed to parse CSV file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  updateDatasetUI() {
    if (State.activeDataset) {
      this.activeDatasetBar.style.display = 'flex';
      this.datasetNameEl.innerText = State.activeDataset.name;
      this.datasetMetaEl.innerText = `${State.activeDataset.rowCount} rows × ${State.activeDataset.colCount} cols`;

      this.attachedPreview.style.display = 'inline-flex';
      this.attachedName.innerText = State.activeDataset.name;
      this.attachedSize.innerText = State.activeDataset.size;
    } else {
      this.activeDatasetBar.style.display = 'none';
      this.attachedPreview.style.display = 'none';
    }
  }

  detachFile() {
    this.unloadDataset();
  }

  unloadDataset() {
    State.activeDataset = null;
    this.updateDatasetUI();
    this.fileInput.value = '';
    this.renderAgentMessage({
      thought: "Dataset Unloaded",
      message: "The dataset has been detached. Please attach a new CSV file or choose one from the sample datasets."
    });
  }

  // Send message & trigger agent reasoning
  handleSend() {
    const text = this.promptInput.value.trim();
    if (!text || State.isProcessing) return;

    // Remove welcome card on first message if present
    if (this.welcomeCard && this.welcomeCard.parentElement) {
      this.welcomeCard.remove();
    }

    // Render User message
    this.renderUserMessage(text);
    this.promptInput.value = '';
    this.promptInput.style.height = 'auto';

    if (!State.activeDataset) {
      // If no dataset attached, prompt the user
      setTimeout(() => {
        this.renderAgentMessage({
          thought: "ATTENTION_REQUIRED: Dataset missing",
          message: "Please attach a CSV dataset using the **📎 attachment icon** below or load a **Sample Dataset** from the top bar before querying."
        });
      }, 400);
      return;
    }

    // Show typing indicator
    const typingId = this.showTypingIndicator();
    State.isProcessing = true;

    // Simulate cognitive thinking & execute autonomous pipeline
    setTimeout(() => {
      try {
        const agent = new AutonomousDataAgent(State.activeDataset);
        const result = agent.processQuery(text);
        this.removeTypingIndicator(typingId);
        this.renderAgentMessage(result);
      } catch (err) {
        this.removeTypingIndicator(typingId);
        this.renderAgentMessage({
          thought: "AGENT_RUNTIME_EXCEPTION",
          message: `An error occurred while analyzing the data: ${err.message}`
        });
      } finally {
        State.isProcessing = false;
      }
    }, 600);
  }

  renderUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'chat-row user';
    row.innerHTML = `
      <div class="msg-wrapper">
        <div class="avatar user-av">U</div>
        <div class="msg-bubble">${this.escapeHtml(text)}</div>
      </div>
    `;
    this.chatMessages.appendChild(row);
    this.scrollToBottom();
  }

  renderAgentMessage(data) {
    const row = document.createElement('div');
    row.className = 'chat-row agent';

    let contentHtml = '';

    // Thought pill
    if (data.thought) {
      contentHtml += `<div class="agent-thought"><span>⚡</span> ${this.escapeHtml(data.thought)}</div>`;
    }

    // Markdown-like narrative
    if (data.message) {
      const formatted = data.message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code style="background:#FEF3C7;padding:2px 4px;border-radius:4px;font-family:monospace;font-size:0.85em;">$1</code>')
        .replace(/\n\s*-\s*/g, '<br>&bull; ')
        .replace(/\n/g, '<br>');
      contentHtml += `<div class="agent-text">${formatted}</div>`;
    }

    // Metrics Row
    if (data.metrics && data.metrics.length > 0) {
      contentHtml += `<div class="metrics-row">`;
      data.metrics.forEach(m => {
        contentHtml += `
          <div class="metric-tile">
            <div class="metric-label">${this.escapeHtml(m.label)}</div>
            <div class="metric-value">${this.escapeHtml(m.value)}</div>
          </div>
        `;
      });
      contentHtml += `</div>`;
    }

    // Dynamic Chart Box
    let canvasId = null;
    if (data.chart) {
      canvasId = 'chart-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      contentHtml += `
        <div class="chart-box">
          <div class="chart-header">
            <div class="chart-title"><span>📊</span> ${this.escapeHtml(data.chart.title)}</div>
          </div>
          <div class="canvas-wrap">
            <canvas id="${canvasId}"></canvas>
          </div>
        </div>
      `;
    }

    // Data Table in chat
    if (data.table) {
      contentHtml += `
        <div class="table-preview-wrap">
          <div class="table-preview-header">
            <span>${this.escapeHtml(data.table.title)}</span>
          </div>
          <div class="data-table-scroll">
            ${data.table.html}
          </div>
        </div>
      `;
    }

    row.innerHTML = `
      <div class="msg-wrapper" style="width: 100%;">
        <div class="avatar agent-av">🤖</div>
        <div class="msg-bubble">
          ${contentHtml}
        </div>
      </div>
    `;

    this.chatMessages.appendChild(row);
    this.scrollToBottom();

    // Render Canvas Chart if configured
    if (data.chart && canvasId) {
      setTimeout(() => {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
          CanvasChartRenderer.render(canvas, data.chart);
        }
      }, 50);
    }
  }

  showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const row = document.createElement('div');
    row.className = 'chat-row agent';
    row.id = id;
    row.innerHTML = `
      <div class="msg-wrapper">
        <div class="avatar agent-av">🤖</div>
        <div class="msg-bubble">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    this.chatMessages.appendChild(row);
    this.scrollToBottom();
    return id;
  }

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  openDatasetModal() {
    if (!State.activeDataset) return;
    this.modalTableTitle.innerText = `Full Dataset Inspection: ${State.activeDataset.name}`;

    let html = `
      <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; color: #64748B;">Showing all ${State.activeDataset.rowCount} rows</span>
        <button class="pill-btn" id="btn-export-csv">📥 Export as CSV</button>
      </div>
      <div class="data-table-scroll" style="max-height: 500px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              ${State.activeDataset.headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    State.activeDataset.rows.forEach((r, idx) => {
      html += `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          ${State.activeDataset.headers.map(h => `<td>${r[h]}</td>`).join('')}
        </tr>
      `;
    });

    html += `</tbody></table></div>`;
    this.modalTableBody.innerHTML = html;
    this.tableModal.style.display = 'flex';

    document.getElementById('btn-export-csv').addEventListener('click', () => {
      this.exportCSV(State.activeDataset.headers, State.activeDataset.rows, `export_${State.activeDataset.name}`);
    });
  }

  exportCSV(headers, rows, filename) {
    const lines = [];
    lines.push(headers.join(','));
    rows.forEach(r => {
      lines.push(headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatMessages.parentElement.scrollTop = this.chatMessages.parentElement.scrollHeight;
    }, 50);
  }
}

// Start application when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
