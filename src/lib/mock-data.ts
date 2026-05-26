import type { Task } from "./tasks";

const now = Date.now();
const hours = (n: number) => new Date(now + n * 3600 * 1000).toISOString();
const days = (n: number) => new Date(now + n * 24 * 3600 * 1000).toISOString();

export const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    name: "Finish Algorithms problem set 4",
    description: "Dynamic programming + graph traversal exercises (Ch. 6-7).",
    deadline: hours(6),
    priority: "high",
    workload: 120,
    status: "in_progress",
    progress: 45,
    category: "School",
    subtasks: [
      { id: "s1", name: "Re-read chapter 6", done: true },
      { id: "s2", name: "Solve problems 1-4", done: true },
      { id: "s3", name: "Solve problems 5-8", done: false },
      { id: "s4", name: "Write up solutions", done: false },
    ],
    scheduledFor: hours(1),
    createdAt: days(-2),
  },
  {
    id: "t2",
    name: "Internship weekly report",
    description: "Summarize sprint progress, blockers, and next steps for mentor.",
    deadline: hours(22),
    priority: "high",
    workload: 60,
    status: "not_started",
    progress: 0,
    category: "Internship",
    subtasks: [
      { id: "s5", name: "Collect metrics", done: false },
      { id: "s6", name: "Draft report", done: false },
      { id: "s7", name: "Send to mentor", done: false },
    ],
    scheduledFor: hours(4),
    createdAt: days(-1),
  },
  {
    id: "t3",
    name: "Microeconomics chapter 4 reading",
    deadline: days(2),
    priority: "medium",
    workload: 45,
    status: "not_started",
    progress: 0,
    category: "School",
    subtasks: [],
    scheduledFor: days(1),
    createdAt: days(-1),
  },
  {
    id: "t4",
    name: "Group project — design slides",
    description: "Visual deck for capstone midpoint review.",
    deadline: days(4),
    priority: "medium",
    workload: 180,
    status: "in_progress",
    progress: 30,
    category: "Project",
    subtasks: [
      { id: "s8", name: "Outline structure", done: true },
      { id: "s9", name: "Draft slides 1-10", done: false },
      { id: "s10", name: "Add visuals", done: false },
      { id: "s11", name: "Team review", done: false },
    ],
    scheduledFor: days(2),
    createdAt: days(-4),
  },
  {
    id: "t5",
    name: "Reply to club emails",
    deadline: hours(12),
    priority: "low",
    workload: 15,
    status: "completed",
    progress: 100,
    category: "Personal",
    subtasks: [],
    createdAt: days(-5),
  },
  {
    id: "t6",
    name: "Part-time shift planning",
    description: "Confirm next week's hours with manager.",
    deadline: days(3),
    priority: "low",
    workload: 20,
    status: "not_started",
    progress: 0,
    category: "Work",
    subtasks: [],
    scheduledFor: days(2),
    createdAt: days(-2),
  },
  {
    id: "t7",
    name: "Research paper outline",
    deadline: days(6),
    priority: "medium",
    workload: 90,
    status: "in_progress",
    progress: 20,
    category: "School",
    subtasks: [
      { id: "s12", name: "Pick topic", done: true },
      { id: "s13", name: "Gather 5 sources", done: false },
      { id: "s14", name: "Draft outline", done: false },
    ],
    scheduledFor: days(3),
    createdAt: days(-3),
  },
  {
    id: "t8",
    name: "Submit lab report",
    deadline: days(-1),
    priority: "high",
    workload: 60,
    status: "overdue",
    progress: 70,
    category: "School",
    subtasks: [],
    createdAt: days(-6),
  },
];

export interface ActivityItem {
  id: string;
  type: "completed" | "created" | "updated" | "rescheduled" | "progress";
  taskName: string;
  time: string;
  detail?: string;
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", type: "completed", taskName: "Reply to club emails", time: hours(-2) },
  { id: "a2", type: "progress", taskName: "Algorithms problem set 4", time: hours(-3), detail: "45% complete" },
  { id: "a3", type: "rescheduled", taskName: "Submit lab report", time: hours(-5), detail: "Moved to today 8pm" },
  { id: "a4", type: "created", taskName: "Research paper outline", time: hours(-26) },
  { id: "a5", type: "updated", taskName: "Group project — slides", time: hours(-30), detail: "Priority raised to Medium" },
  { id: "a6", type: "completed", taskName: "Read Statistics ch.2", time: hours(-48) },
  { id: "a7", type: "progress", taskName: "Internship weekly report", time: hours(-54), detail: "Outline drafted" },
];

export const WEEKLY_COMPLETION = [
  { day: "Mon", completed: 4, planned: 5 },
  { day: "Tue", completed: 6, planned: 6 },
  { day: "Wed", completed: 3, planned: 5 },
  { day: "Thu", completed: 5, planned: 5 },
  { day: "Fri", completed: 7, planned: 8 },
  { day: "Sat", completed: 2, planned: 3 },
  { day: "Sun", completed: 1, planned: 2 },
];

export const RECOMMENDATIONS = [
  {
    id: "r1",
    title: "Focus on Algorithms PS4",
    reason: "Due in 6 hours · highest priority score",
    icon: "target",
  },
  {
    id: "r2",
    title: "Best deep-work slot: 2pm – 4pm",
    reason: "You historically complete 38% more during this window",
    icon: "clock",
  },
  {
    id: "r3",
    title: "Take a 15-min break after PS4",
    reason: "Two heavy tasks back-to-back drains focus",
    icon: "coffee",
  },
  {
    id: "r4",
    title: "Suggested study session",
    reason: "45 minutes on Microeconomics ch.4 tonight",
    icon: "book",
  },
];
