// ─────────────────────────────────────────────
//  BrainGauge · Static Quiz Data
//  No OpenAI API — all questions are hardcoded.
//  Adaptive difficulty is handled by rule-based
//  logic in src/hooks/useAdaptiveQuiz.js
// ─────────────────────────────────────────────

export const SUBJECTS = [
  { id: "algorithms",       label: "Algorithms",         icon: "ti-math" },
  { id: "databases",        label: "Databases",          icon: "ti-database" },
  { id: "os",               label: "Operating Systems",  icon: "ti-cpu" },
  { id: "networks",         label: "Computer Networks",  icon: "ti-network" },
  { id: "data_structures",  label: "Data Structures",    icon: "ti-code" },
  { id: "web",              label: "Web Technologies",   icon: "ti-world" },
];

// difficulty: "easy" | "medium" | "hard"
export const QUESTIONS = [
  // ── Algorithms ──────────────────────────────
  {
    id: "alg_001", subject: "algorithms", difficulty: "easy",
    question: "What is the time complexity of Binary Search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    answer: 1,
    explanation: "Binary Search halves the search space each step → O(log n).",
  },
  {
    id: "alg_002", subject: "algorithms", difficulty: "easy",
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    answer: 2,
    explanation: "Merge Sort runs in O(n log n) average and worst case.",
  },
  {
    id: "alg_003", subject: "algorithms", difficulty: "medium",
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    answer: 2,
    explanation: "Quick Sort degrades to O(n²) when the pivot is always the smallest/largest element.",
  },
  {
    id: "alg_004", subject: "algorithms", difficulty: "medium",
    question: "Dijkstra's algorithm is used to find:",
    options: [
      "Minimum spanning tree",
      "Shortest path in an unweighted graph",
      "Shortest path in a weighted graph (non-negative weights)",
      "Topological ordering",
    ],
    answer: 2,
    explanation: "Dijkstra finds shortest paths from a source in graphs with non-negative edge weights.",
  },
  {
    id: "alg_005", subject: "algorithms", difficulty: "hard",
    question: "Which algorithm design paradigm does the Bellman-Ford algorithm use?",
    options: ["Greedy", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
    answer: 2,
    explanation: "Bellman-Ford relaxes all edges V-1 times using dynamic programming to handle negative weights.",
  },
  {
    id: "alg_006", subject: "algorithms", difficulty: "hard",
    question: "What is the space complexity of the recursive Merge Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 2,
    explanation: "Merge Sort requires O(n) auxiliary space for the temporary arrays during merging.",
  },

  // ── Databases ───────────────────────────────
  {
    id: "db_001", subject: "databases", difficulty: "easy",
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Language",
      "Standard Query Logic",
      "Sequential Query Language",
    ],
    answer: 0,
    explanation: "SQL = Structured Query Language, the standard language for relational databases.",
  },
  {
    id: "db_002", subject: "databases", difficulty: "easy",
    question: "Which SQL clause is used to filter rows?",
    options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
    answer: 2,
    explanation: "WHERE filters individual rows before grouping; HAVING filters after GROUP BY.",
  },
  {
    id: "db_003", subject: "databases", difficulty: "medium",
    question: "What is a Primary Key?",
    options: [
      "A key that can have NULL values",
      "A unique identifier for each row in a table",
      "A key shared between two tables",
      "An index on a non-unique column",
    ],
    answer: 1,
    explanation: "A Primary Key uniquely identifies each record and cannot be NULL.",
  },
  {
    id: "db_004", subject: "databases", difficulty: "medium",
    question: "Which normal form eliminates transitive dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: 2,
    explanation: "3NF removes transitive dependencies: non-key attributes must depend only on the primary key.",
  },
  {
    id: "db_005", subject: "databases", difficulty: "hard",
    question: "In the ACID properties, what does 'Isolation' mean?",
    options: [
      "Transactions are permanent once committed",
      "Concurrent transactions produce the same result as sequential execution",
      "A transaction is treated as a single unit",
      "The database is always in a consistent state",
    ],
    answer: 1,
    explanation: "Isolation ensures that concurrent transactions do not interfere — the result is as if they ran serially.",
  },
  {
    id: "db_006", subject: "databases", difficulty: "hard",
    question: "Which join returns all rows from both tables, with NULLs where no match exists?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    answer: 3,
    explanation: "FULL OUTER JOIN returns all rows from both tables; unmatched rows get NULLs on the opposite side.",
  },

  // ── Operating Systems ────────────────────────
  {
    id: "os_001", subject: "os", difficulty: "easy",
    question: "What is a process?",
    options: [
      "A program stored on disk",
      "A program in execution",
      "A section of memory",
      "A CPU instruction",
    ],
    answer: 1,
    explanation: "A process is an instance of a program in execution, with its own memory space and resources.",
  },
  {
    id: "os_002", subject: "os", difficulty: "easy",
    question: "Which scheduling algorithm gives the CPU to the process with the shortest burst time?",
    options: ["FCFS", "Round Robin", "SJF", "Priority Scheduling"],
    answer: 2,
    explanation: "Shortest Job First (SJF) selects the process with the smallest CPU burst time next.",
  },
  {
    id: "os_003", subject: "os", difficulty: "medium",
    question: "What is a deadlock?",
    options: [
      "When a process terminates unexpectedly",
      "When all processes are in a waiting state and none can proceed",
      "When CPU utilization reaches 100%",
      "When memory is completely consumed",
    ],
    answer: 1,
    explanation: "Deadlock occurs when processes hold resources and wait for others held by each other — circular waiting.",
  },
  {
    id: "os_004", subject: "os", difficulty: "medium",
    question: "Which page replacement algorithm suffers from Belady's anomaly?",
    options: ["LRU", "Optimal", "FIFO", "LFU"],
    answer: 2,
    explanation: "FIFO can produce more page faults when more frames are added — known as Belady's anomaly.",
  },
  {
    id: "os_005", subject: "os", difficulty: "hard",
    question: "Which of the following is NOT a necessary condition for deadlock?",
    options: ["Mutual Exclusion", "Preemption", "Hold and Wait", "Circular Wait"],
    answer: 1,
    explanation: "Preemption (resources can be taken away) actually PREVENTS deadlock. The four necessary conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
  },

  // ── Computer Networks ────────────────────────
  {
    id: "net_001", subject: "networks", difficulty: "easy",
    question: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyper Terminal Transfer Protocol",
      "HyperText Transmission Process",
    ],
    answer: 0,
    explanation: "HTTP = HyperText Transfer Protocol, the foundation of data communication on the web.",
  },
  {
    id: "net_002", subject: "networks", difficulty: "easy",
    question: "Which layer of the OSI model handles end-to-end communication?",
    options: ["Network Layer", "Data Link Layer", "Transport Layer", "Session Layer"],
    answer: 2,
    explanation: "The Transport Layer (Layer 4) handles end-to-end communication and error recovery (TCP/UDP).",
  },
  {
    id: "net_003", subject: "networks", difficulty: "medium",
    question: "What is the default port for HTTPS?",
    options: ["80", "21", "443", "8080"],
    answer: 2,
    explanation: "HTTPS uses port 443 by default; HTTP uses port 80.",
  },
  {
    id: "net_004", subject: "networks", difficulty: "hard",
    question: "Which routing protocol uses the Bellman-Ford algorithm?",
    options: ["OSPF", "BGP", "RIP", "EIGRP"],
    answer: 2,
    explanation: "RIP (Routing Information Protocol) uses the Bellman-Ford algorithm to calculate routes.",
  },

  // ── Data Structures ──────────────────────────
  {
    id: "ds_001", subject: "data_structures", difficulty: "easy",
    question: "Which data structure follows LIFO order?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    answer: 1,
    explanation: "A Stack follows Last-In-First-Out (LIFO) — the last element pushed is the first popped.",
  },
  {
    id: "ds_002", subject: "data_structures", difficulty: "easy",
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    answer: 2,
    explanation: "Array access by index is O(1) — direct memory address calculation.",
  },
  {
    id: "ds_003", subject: "data_structures", difficulty: "medium",
    question: "In a Binary Search Tree, where is the smallest element located?",
    options: ["Root", "Rightmost node", "Leftmost node", "Any leaf node"],
    answer: 2,
    explanation: "In a BST, all left subtree values are smaller than the root, so the leftmost node is the minimum.",
  },
  {
    id: "ds_004", subject: "data_structures", difficulty: "medium",
    question: "Which data structure is best suited for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Stack"],
    answer: 2,
    explanation: "A Heap (min-heap or max-heap) provides O(log n) insert and O(1) access to the priority element.",
  },
  {
    id: "ds_005", subject: "data_structures", difficulty: "hard",
    question: "What is the height of a complete binary tree with n nodes?",
    options: ["O(n)", "O(log n)", "O(√n)", "O(n log n)"],
    answer: 1,
    explanation: "A complete binary tree fills levels left to right; height = ⌊log₂(n)⌋ → O(log n).",
  },

  // ── Web Technologies ─────────────────────────
  {
    id: "web_001", subject: "web", difficulty: "easy",
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Dynamic Object Module",
      "Document Oriented Markup",
    ],
    answer: 0,
    explanation: "DOM = Document Object Model, a programming interface for HTML/XML documents.",
  },
  {
    id: "web_002", subject: "web", difficulty: "easy",
    question: "Which HTTP method is used to send data to a server to create a resource?",
    options: ["GET", "PUT", "POST", "DELETE"],
    answer: 2,
    explanation: "POST sends data to create a new resource on the server.",
  },
  {
    id: "web_003", subject: "web", difficulty: "medium",
    question: "What is the purpose of JWT (JSON Web Token)?",
    options: [
      "Encrypting database passwords",
      "Styling web pages",
      "Stateless authentication and authorization",
      "Compressing JSON data",
    ],
    answer: 2,
    explanation: "JWT is used for stateless auth — the token contains encoded user info and is verified without a DB lookup.",
  },
  {
    id: "web_004", subject: "web", difficulty: "hard",
    question: "What is the difference between localStorage and sessionStorage?",
    options: [
      "localStorage is faster than sessionStorage",
      "sessionStorage data persists after the browser tab is closed; localStorage does not",
      "localStorage persists until manually cleared; sessionStorage clears when the tab closes",
      "They are identical in behavior",
    ],
    answer: 2,
    explanation: "localStorage persists across sessions; sessionStorage is cleared when the tab/window is closed.",
  },
];

// ── Helpers ──────────────────────────────────

/** Get questions by subject and optionally filter by difficulty */
export function getQuestions(subjectId, difficulty = null) {
  return QUESTIONS.filter(
    (q) =>
      q.subject === subjectId &&
      (difficulty === null || q.difficulty === difficulty)
  );
}

/** Get a quiz set: mixed difficulties, shuffled, limited to `count` */
export function buildQuizSet(subjectId, count = 10) {
  const pool = QUESTIONS.filter((q) => q.subject === subjectId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** Adaptive: based on last N answers, return next difficulty */
export function getNextDifficulty(history) {
  if (history.length < 3) return "easy";
  const recent = history.slice(-3);
  const correct = recent.filter(Boolean).length;
  if (correct === 3) return "hard";
  if (correct >= 2) return "medium";
  return "easy";
}
