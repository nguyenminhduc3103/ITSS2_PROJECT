import type { Task } from "./tasks";

const now = Date.now();
const hours = (n: number) => new Date(now + n * 3600 * 1000).toISOString();
const days = (n: number) => new Date(now + n * 24 * 3600 * 1000).toISOString();

export const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    name: "Hoàn thành bài tập Thuật toán 4",
    description: "Quy hoạch động + duyệt đồ thị (chương 6-7).",
    deadline: hours(6),
    priority: "high",
    workload: 120,
    status: "in_progress",
    progress: 45,
    category: "School",
    subtasks: [
      { id: "s1", name: "Đọc lại chương 6", done: true },
      { id: "s2", name: "Giải bài 1-4", done: true },
      { id: "s3", name: "Giải bài 5-8", done: false },
      { id: "s4", name: "Viết lời giải hoàn chỉnh", done: false },
    ],
    scheduledFor: hours(1),
    createdAt: days(-2),
  },
  {
    id: "t2",
    name: "Báo cáo thực tập tuần",
    description: "Tổng kết tiến độ sprint, vướng mắc và bước tiếp theo cho mentor.",
    deadline: hours(22),
    priority: "high",
    workload: 60,
    status: "not_started",
    progress: 0,
    category: "Work",
    subtasks: [
      { id: "s5", name: "Thu thập số liệu", done: false },
      { id: "s6", name: "Soạn báo cáo", done: false },
      { id: "s7", name: "Gửi cho mentor", done: false },
    ],
    scheduledFor: hours(4),
    createdAt: days(-1),
  },
  {
    id: "t3",
    name: "Đọc Kinh tế vi mô chương 4",
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
    name: "Thiết kế slide thuyết trình nhóm",
    description: "Bộ slide cho buổi review giữa kỳ capstone.",
    deadline: days(4),
    priority: "medium",
    workload: 180,
    status: "in_progress",
    progress: 30,
    category: "School",
    subtasks: [
      { id: "s8", name: "Lập outline", done: true },
      { id: "s9", name: "Soạn slide 1-10", done: false },
      { id: "s10", name: "Thêm hình minh hoạ", done: false },
      { id: "s11", name: "Cả nhóm cùng review", done: false },
    ],
    scheduledFor: days(2),
    createdAt: days(-4),
  },
  {
    id: "t5",
    name: "Trả email câu lạc bộ",
    deadline: hours(12),
    priority: "low",
    workload: 15,
    status: "completed",
    progress: 100,
    category: "Work",
    subtasks: [],
    createdAt: days(-5),
  },
  {
    id: "t6",
    name: "Sắp xếp ca làm thêm tuần tới",
    description: "Xác nhận giờ làm với quản lý.",
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
    name: "Outline bài nghiên cứu",
    deadline: days(6),
    priority: "medium",
    workload: 90,
    status: "in_progress",
    progress: 20,
    category: "School",
    subtasks: [
      { id: "s12", name: "Chọn chủ đề", done: true },
      { id: "s13", name: "Tìm 5 nguồn tham khảo", done: false },
      { id: "s14", name: "Lập dàn ý", done: false },
    ],
    scheduledFor: days(3),
    createdAt: days(-3),
  },
  {
    id: "t8",
    name: "Nộp báo cáo thí nghiệm",
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
  { id: "a1", type: "completed", taskName: "Trả email câu lạc bộ", time: hours(-2) },
  { id: "a2", type: "progress", taskName: "Bài tập Thuật toán 4", time: hours(-3), detail: "45% hoàn thành" },
  { id: "a3", type: "rescheduled", taskName: "Nộp báo cáo thí nghiệm", time: hours(-5), detail: "Dời sang 20h tối nay" },
  { id: "a4", type: "created", taskName: "Outline bài nghiên cứu", time: hours(-26) },
  { id: "a5", type: "updated", taskName: "Slide thuyết trình nhóm", time: hours(-30), detail: "Nâng ưu tiên lên Vừa" },
  { id: "a6", type: "completed", taskName: "Đọc Thống kê chương 2", time: hours(-48) },
  { id: "a7", type: "progress", taskName: "Báo cáo thực tập tuần", time: hours(-54), detail: "Đã có dàn ý" },
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
  { id: "r1", titleKey: "rec.1.title", reasonKey: "rec.1.reason", icon: "target" },
  { id: "r2", titleKey: "rec.2.title", reasonKey: "rec.2.reason", icon: "clock" },
  { id: "r3", titleKey: "rec.3.title", reasonKey: "rec.3.reason", icon: "coffee" },
  { id: "r4", titleKey: "rec.4.title", reasonKey: "rec.4.reason", icon: "book" },
];
