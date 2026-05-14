// ─────────────────────────────────────────────
//  BrainGauge · Static Dashboard Analytics Data
//  Replace with real API calls once backend is ready.
// ─────────────────────────────────────────────

export const STUDENT_PROFILE = {
  name: "Mohit Kumar",
  initials: "MK",
  role: "Student · MCA Final",
  email: "mohit@braingauge.app",
};

export const STATS = {
  quizzesTaken: 47,
  quizzesDelta: "+8 this week",
  avgScore: 78,
  avgScoreDelta: "+4% vs last week",
  streak: 12,
  bestStreak: 21,
  accuracy: 84,
  accuracyDelta: "-2% this week",
};

export const WEEKLY_ACTIVITY = [
  { day: "Mon", quizzes: 3, accuracy: 72 },
  { day: "Tue", quizzes: 5, accuracy: 80 },
  { day: "Wed", quizzes: 2, accuracy: 68 },
  { day: "Thu", quizzes: 7, accuracy: 85 },
  { day: "Fri", quizzes: 4, accuracy: 78 },
  { day: "Sat", quizzes: 6, accuracy: 90 },
  { day: "Sun", quizzes: 3, accuracy: 76 },
];

export const DIFFICULTY_BREAKDOWN = [
  { label: "Easy",   pct: 62, color: "var(--color-easy)" },
  { label: "Medium", pct: 28, color: "var(--color-medium)" },
  { label: "Hard",   pct: 10, color: "var(--color-hard)" },
];

export const TOPIC_PROGRESS = [
  { label: "Algorithms",        pct: 88, color: "var(--color-primary)" },
  { label: "Databases",         pct: 72, color: "var(--color-primary-lt)" },
  { label: "Operating Systems", pct: 58, color: "var(--color-medium)" },
  { label: "Computer Networks", pct: 45, color: "var(--color-hard)" },
];

export const OVERALL_PROGRESS = {
  pct: 75,
  done: 36,
  total: 48,
};

export const RECENT_QUIZZES = [
  {
    id: 1,
    name: "Algebra Fundamentals",
    subject: "algorithms",
    icon: "ti-math",
    questions: 10,
    duration: "8 min",
    difficulty: "Easy",
    score: 92,
  },
  {
    id: 2,
    name: "Data Structures — Arrays",
    subject: "data_structures",
    icon: "ti-code",
    questions: 15,
    duration: "12 min",
    difficulty: "Medium",
    score: 74,
  },
  {
    id: 3,
    name: "SQL Joins & Queries",
    subject: "databases",
    icon: "ti-database",
    questions: 12,
    duration: "10 min",
    difficulty: "Medium",
    score: 81,
  },
  {
    id: 4,
    name: "OS Process Scheduling",
    subject: "os",
    icon: "ti-cpu",
    questions: 20,
    duration: "18 min",
    difficulty: "Hard",
    score: 61,
  },
];

export const UPCOMING_QUIZZES = [
  {
    id: 1,
    name: "Mock Test — DBMS",
    when: "Tomorrow",
    questions: 30,
    accent: false,
    icon: "ti-calendar",
  },
  {
    id: 2,
    name: "Viva Prep Quiz",
    when: "In 3 days",
    questions: 20,
    accent: true,
    icon: "ti-clock",
  },
];

export const NOTIFICATIONS = [
  { id: 1, text: "You completed a 12-day streak! 🔥", time: "2m ago", read: false },
  { id: 2, text: "New quiz available: Computer Networks", time: "1h ago", read: false },
  { id: 3, text: "Your accuracy dropped 2% this week", time: "3h ago", read: false },
  { id: 4, text: "Mock Test — DBMS is due tomorrow", time: "1d ago", read: true },
];
