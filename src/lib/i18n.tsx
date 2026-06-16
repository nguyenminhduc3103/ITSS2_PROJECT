import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "vi" | "en" | "ja";

type Dict = Record<string, string>;

const dicts: Record<Lang, Dict> = {
  vi: {
    "app.tagline": "Quản lý học tập",
    "nav.dashboard": "Bảng điều khiển",
    "nav.tasks": "Công việc",
    "nav.calendar": "Lịch",
    "nav.analytics": "Thống kê",
    "nav.activity": "Hoạt động",
    "topbar.search": "Tìm công việc, dự án...",
    "sidebar.streak": "Chuỗi tuần này",
    "sidebar.streak.value": "5 ngày 🔥",
    "sidebar.streak.sub": "Giữ vững nhịp độ nhé.",

    "greeting.morning": "Chào buổi sáng 👋",
    "greeting.afternoon": "Chào buổi chiều 👋",
    "greeting.evening": "Chào buổi tối 👋",
    "dashboard.subtitle": "Tổng quan nhẹ nhàng cho ngày hôm nay.",
    "dashboard.topPriority": "Ưu tiên hàng đầu",
    "dashboard.urgent": "Khẩn cấp · trong 24h tới",
    "dashboard.urgent.count": "công việc",
    "dashboard.upcoming": "Sắp tới trong tuần",
    "dashboard.recent": "Hoạt động gần đây",

    "tasks.title": "Tất cả công việc",
    "tasks.subtitle": "Toàn bộ khối lượng việc của bạn ở một nơi.",
    "tasks.search": "Tìm công việc...",
    "tasks.filter.all": "Tất cả",
    "tasks.filter.active": "Đang làm",
    "tasks.filter.overdue": "Quá hạn",
    "tasks.filter.completed": "Hoàn thành",
    "tasks.sort.smart": "Ưu tiên thông minh",
    "tasks.sort.deadline": "Hạn gần nhất",
    "tasks.sort.priority": "Mức quan trọng",
    "tasks.sort.workload": "Khối lượng",
    "tasks.priority": "Ưu tiên:",
    "tasks.empty": "Chưa có gì. Hãy thêm công việc đầu tiên để bắt đầu.",

    "calendar.title": "Lịch",
    "calendar.subtitle": "Lịch tuần thân thiện, có khối thời gian và phát hiện trùng lịch.",
    "calendar.overdue": "công việc quá hạn",
    "calendar.overdue.sub": "Hãy dời lịch để tuần của bạn thực tế hơn.",
    "calendar.rescheduleFirst": "Dời việc đầu tiên",
    "calendar.overlap": "⚠ Khối thời gian bị trùng",
    "calendar.overlap.sub": "Bạn đang đặt nhiều việc cùng khung giờ. Cân nhắc dời một việc.",
    "calendar.today": "Kế hoạch hôm nay",
    "calendar.noPlan": "Hôm nay chưa có khối nào.",
    "calendar.alloc": "Phân bổ thời gian",
    "calendar.alloc.sub": "giờ đã lên lịch trong tuần",
    "calendar.needReschedule": "Cần dời lịch",
    "calendar.due": "Hạn",

    "analytics.title": "Thống kê",
    "analytics.subtitle": "Xu hướng, khối lượng và hiệu suất tuần.",
    "analytics.completion": "Tỷ lệ hoàn thành",
    "analytics.thisWeek": "tuần này",
    "analytics.active": "Đang làm",
    "analytics.activeSub": "đang tiến hành",
    "analytics.workloadLeft": "Khối lượng còn lại",
    "analytics.workloadSub": "trên các việc chưa xong",
    "analytics.overdue": "Quá hạn",
    "analytics.overdueSub": "cần dời lịch",
    "analytics.byCategory": "Khối lượng theo phân loại",
    "analytics.byCategory.sub": "Số phút còn lại theo mảng việc",
    "analytics.recent": "Hoạt động gần đây",

    "activity.title": "Hoạt động",
    "activity.subtitle": "Tất cả những gì bạn đã hoàn thành gần đây.",

    "weekly.title": "Năng suất tuần",
    "weekly.sub": "Đã hoàn thành so với kế hoạch",
    "weekly.completed": "Hoàn thành",
    "weekly.planned": "Kế hoạch",

    "overview.thisWeek": "Tuần này",
    "overview.of": "trên",
    "overview.completed": "hoàn thành",
    "overview.done": "Hoàn thành",
    "overview.inProgress": "Đang làm",
    "overview.todo": "Cần làm",
    "overview.overdue": "Quá hạn",

    "rec.title": "Gợi ý cho hôm nay",
    "rec.1.title": "Tập trung vào bài tập Thuật toán",
    "rec.1.reason": "Hạn còn 6 giờ · ưu tiên cao nhất",
    "rec.2.title": "Khung deep-work tốt nhất: 14h – 16h",
    "rec.2.reason": "Bạn hoàn thành nhiều hơn 38% trong khung này",
    "rec.3.title": "Nghỉ 15 phút sau khi làm xong bài tập",
    "rec.3.reason": "Hai việc nặng liên tiếp dễ làm cạn sự tập trung",
    "rec.4.title": "Phiên học gợi ý",
    "rec.4.reason": "45 phút Kinh tế vi mô chương 4 tối nay",

    "priority.high": "Cao",
    "priority.medium": "Vừa",
    "priority.low": "Thấp",

    "status.not_started": "Chưa bắt đầu",
    "status.in_progress": "Đang làm",
    "status.completed": "Hoàn thành",
    "status.overdue": "Quá hạn",

    "category.School": "Học tập",
    "category.Work": "Công việc",
    "category.All": "Tất cả",

    "task.addBtn": "Thêm việc",
    "task.new": "Việc mới",
    "task.new.desc": "Ghi lại điều bạn đang nghĩ. Chúng tôi sẽ tự xếp ưu tiên.",
    "task.name": "Tên công việc",
    "task.name.placeholder": "vd. Hoàn thành báo cáo Lịch sử",
    "task.description": "Mô tả",
    "task.description.placeholder": "Ghi chú tuỳ ý",
    "task.deadline": "Hạn chót",
    "task.priority": "Ưu tiên",
    "task.category": "Phân loại",
    "task.workload": "Thời lượng (phút)",
    "task.cancel": "Huỷ",
    "task.add": "Thêm việc",
    "task.edit": "Chỉnh sửa việc",
    "task.edit.desc": "Cập nhật chi tiết và quản lý các việc con.",
    "task.save": "Lưu thay đổi",
    "task.subtasks": "Việc con",
    "task.subtask.placeholder": "Thêm việc con rồi nhấn Enter...",
    "task.subtask.add": "Thêm một việc con...",
    "task.subtask.count": "việc con",
    "task.mins": "phút",
    "task.click.edit": "Bấm để chỉnh sửa",
    "task.dbl.rename": "Nhấp đúp để đổi tên",

    "reschedule.title": "Dời lịch công việc",
    "reschedule.desc": "Chúng tôi sẽ tính lại ưu tiên cho phần còn lại của tuần.",
    "reschedule.was": "Hạn cũ",
    "reschedule.new": "Hạn mới",
    "reschedule.pick": "Chọn hạn mới",
    "reschedule.note": "Lịch 3 ngày tới sẽ được tự điều chỉnh.",
    "reschedule.confirm": "Xác nhận dời lịch",

    "activity.completed": "Hoàn thành",
    "activity.created": "Đã tạo",
    "activity.updated": "Cập nhật",
    "activity.rescheduled": "Dời lịch",
    "activity.progress": "Tiến độ",
  },
  en: {
    "app.tagline": "Student planner",
    "nav.dashboard": "Dashboard",
    "nav.tasks": "Tasks",
    "nav.calendar": "Calendar",
    "nav.analytics": "Analytics",
    "nav.activity": "Activity",
    "topbar.search": "Search tasks, projects...",
    "sidebar.streak": "Weekly streak",
    "sidebar.streak.value": "5 days 🔥",
    "sidebar.streak.sub": "Keep the rhythm going.",

    "greeting.morning": "Good morning 👋",
    "greeting.afternoon": "Good afternoon 👋",
    "greeting.evening": "Good evening 👋",
    "dashboard.subtitle": "Here's a calm overview of your day.",
    "dashboard.topPriority": "Top priority",
    "dashboard.urgent": "Urgent · next 24h",
    "dashboard.urgent.count": "tasks",
    "dashboard.upcoming": "Upcoming this week",
    "dashboard.recent": "Recent activity",

    "tasks.title": "All tasks",
    "tasks.subtitle": "Your full workload in one place.",
    "tasks.search": "Search tasks...",
    "tasks.filter.all": "All",
    "tasks.filter.active": "Active",
    "tasks.filter.overdue": "Overdue",
    "tasks.filter.completed": "Completed",
    "tasks.sort.smart": "Smart priority",
    "tasks.sort.deadline": "Soonest deadline",
    "tasks.sort.priority": "Importance",
    "tasks.sort.workload": "Workload",
    "tasks.priority": "Priority:",
    "tasks.empty": "Nothing here. Add your first task to get started.",

    "calendar.title": "Calendar",
    "calendar.subtitle": "Drag-friendly weekly planner with time blocks and conflict detection.",
    "calendar.overdue": "tasks overdue",
    "calendar.overdue.sub": "Reschedule them to keep your week realistic.",
    "calendar.rescheduleFirst": "Reschedule first",
    "calendar.overlap": "⚠ Overlapping time blocks",
    "calendar.overlap.sub": "You've scheduled multiple tasks for the same slot.",
    "calendar.today": "Today's plan",
    "calendar.noPlan": "No scheduled blocks today.",
    "calendar.alloc": "Time allocation",
    "calendar.alloc.sub": "hours scheduled this week",
    "calendar.needReschedule": "Needs rescheduling",
    "calendar.due": "Due",

    "analytics.title": "Analytics",
    "analytics.subtitle": "Trends, workload, and weekly performance.",
    "analytics.completion": "Completion rate",
    "analytics.thisWeek": "this week",
    "analytics.active": "Active tasks",
    "analytics.activeSub": "in progress",
    "analytics.workloadLeft": "Workload left",
    "analytics.workloadSub": "across pending tasks",
    "analytics.overdue": "Overdue",
    "analytics.overdueSub": "needs rescheduling",
    "analytics.byCategory": "Workload by category",
    "analytics.byCategory.sub": "Pending minutes across categories",
    "analytics.recent": "Recent activity",

    "activity.title": "Activity",
    "activity.subtitle": "Everything you've shipped recently.",

    "weekly.title": "Weekly productivity",
    "weekly.sub": "Tasks completed vs planned",
    "weekly.completed": "Completed",
    "weekly.planned": "Planned",

    "overview.thisWeek": "This week",
    "overview.of": "of",
    "overview.completed": "completed",
    "overview.done": "Done",
    "overview.inProgress": "In progress",
    "overview.todo": "To do",
    "overview.overdue": "Overdue",

    "rec.title": "Suggestions for today",
    "rec.1.title": "Focus on Algorithms problem set",
    "rec.1.reason": "Due in 6 hours · highest priority",
    "rec.2.title": "Best deep-work slot: 2pm – 4pm",
    "rec.2.reason": "You complete 38% more during this window",
    "rec.3.title": "Take a 15-min break after PS",
    "rec.3.reason": "Two heavy tasks back-to-back drains focus",
    "rec.4.title": "Suggested study session",
    "rec.4.reason": "45 minutes on Microeconomics ch.4 tonight",

    "priority.high": "High",
    "priority.medium": "Medium",
    "priority.low": "Low",

    "status.not_started": "Not started",
    "status.in_progress": "In progress",
    "status.completed": "Done",
    "status.overdue": "Overdue",

    "category.School": "School",
    "category.Work": "Work",
    "category.All": "All",

    "task.addBtn": "Add task",
    "task.new": "New task",
    "task.new.desc": "Capture what's on your mind. We'll handle the prioritization.",
    "task.name": "Task name",
    "task.name.placeholder": "e.g. Finish history essay",
    "task.description": "Description",
    "task.description.placeholder": "Optional notes",
    "task.deadline": "Deadline",
    "task.priority": "Priority",
    "task.category": "Category",
    "task.workload": "Workload (min)",
    "task.cancel": "Cancel",
    "task.add": "Add task",
    "task.edit": "Edit task",
    "task.edit.desc": "Update details and manage subtasks.",
    "task.save": "Save changes",
    "task.subtasks": "Subtasks",
    "task.subtask.placeholder": "Add a subtask and press Enter...",
    "task.subtask.add": "Add a subtask...",
    "task.subtask.count": "subtasks",
    "task.mins": "min",
    "task.click.edit": "Click to edit",
    "task.dbl.rename": "Double-click to rename",

    "reschedule.title": "Reschedule task",
    "reschedule.desc": "We'll recalculate your priorities for the rest of the week.",
    "reschedule.was": "Was due",
    "reschedule.new": "New deadline",
    "reschedule.pick": "Pick a new deadline",
    "reschedule.note": "Your schedule for the next 3 days will be auto-adjusted.",
    "reschedule.confirm": "Confirm reschedule",

    "activity.completed": "Completed",
    "activity.created": "Created",
    "activity.updated": "Updated",
    "activity.rescheduled": "Rescheduled",
    "activity.progress": "Progress",
  },
  ja: {
    "app.tagline": "学生向けプランナー",
    "nav.dashboard": "ダッシュボード",
    "nav.tasks": "タスク",
    "nav.calendar": "カレンダー",
    "nav.analytics": "分析",
    "nav.activity": "アクティビティ",
    "topbar.search": "タスクやプロジェクトを検索...",
    "sidebar.streak": "今週の連続記録",
    "sidebar.streak.value": "5日 🔥",
    "sidebar.streak.sub": "このリズムを保ちましょう。",

    "greeting.morning": "おはようございます 👋",
    "greeting.afternoon": "こんにちは 👋",
    "greeting.evening": "こんばんは 👋",
    "dashboard.subtitle": "今日の落ち着いた概要です。",
    "dashboard.topPriority": "最優先",
    "dashboard.urgent": "緊急 · 24時間以内",
    "dashboard.urgent.count": "件",
    "dashboard.upcoming": "今週の予定",
    "dashboard.recent": "最近のアクティビティ",

    "tasks.title": "すべてのタスク",
    "tasks.subtitle": "あなたの作業を一画面で。",
    "tasks.search": "タスクを検索...",
    "tasks.filter.all": "すべて",
    "tasks.filter.active": "進行中",
    "tasks.filter.overdue": "期限切れ",
    "tasks.filter.completed": "完了",
    "tasks.sort.smart": "スマート優先度",
    "tasks.sort.deadline": "期限が近い順",
    "tasks.sort.priority": "重要度",
    "tasks.sort.workload": "作業量",
    "tasks.priority": "優先度:",
    "tasks.empty": "まだありません。最初のタスクを追加しましょう。",

    "calendar.title": "カレンダー",
    "calendar.subtitle": "時間ブロックと重複検出付きの週間プランナー。",
    "calendar.overdue": "件が期限切れ",
    "calendar.overdue.sub": "再スケジュールして現実的な週にしましょう。",
    "calendar.rescheduleFirst": "最初の1件を再調整",
    "calendar.overlap": "⚠ 時間ブロックが重複しています",
    "calendar.overlap.sub": "同じ枠に複数のタスクがあります。",
    "calendar.today": "今日の予定",
    "calendar.noPlan": "今日の予定ブロックはありません。",
    "calendar.alloc": "時間配分",
    "calendar.alloc.sub": "時間が今週予定済み",
    "calendar.needReschedule": "再調整が必要",
    "calendar.due": "期限",

    "analytics.title": "分析",
    "analytics.subtitle": "傾向・作業量・週次パフォーマンス。",
    "analytics.completion": "完了率",
    "analytics.thisWeek": "今週",
    "analytics.active": "進行中のタスク",
    "analytics.activeSub": "進行中",
    "analytics.workloadLeft": "残り作業量",
    "analytics.workloadSub": "未完了タスクの合計",
    "analytics.overdue": "期限切れ",
    "analytics.overdueSub": "再調整が必要",
    "analytics.byCategory": "カテゴリ別作業量",
    "analytics.byCategory.sub": "カテゴリごとの残り分数",
    "analytics.recent": "最近のアクティビティ",

    "activity.title": "アクティビティ",
    "activity.subtitle": "最近の成果一覧。",

    "weekly.title": "週間生産性",
    "weekly.sub": "完了 vs 計画",
    "weekly.completed": "完了",
    "weekly.planned": "計画",

    "overview.thisWeek": "今週",
    "overview.of": "/",
    "overview.completed": "完了",
    "overview.done": "完了",
    "overview.inProgress": "進行中",
    "overview.todo": "未着手",
    "overview.overdue": "期限切れ",

    "rec.title": "今日のおすすめ",
    "rec.1.title": "アルゴリズム課題に集中",
    "rec.1.reason": "あと6時間 · 最優先",
    "rec.2.title": "ベスト集中時間: 14時〜16時",
    "rec.2.reason": "この時間帯は38%多く完了しています",
    "rec.3.title": "課題後に15分休憩",
    "rec.3.reason": "重い作業の連続は集中力を消耗します",
    "rec.4.title": "おすすめ学習セッション",
    "rec.4.reason": "今夜45分、ミクロ経済学 第4章",

    "priority.high": "高",
    "priority.medium": "中",
    "priority.low": "低",

    "status.not_started": "未着手",
    "status.in_progress": "進行中",
    "status.completed": "完了",
    "status.overdue": "期限切れ",

    "category.School": "学校",
    "category.Work": "仕事",
    "category.All": "すべて",

    "task.addBtn": "タスクを追加",
    "task.new": "新しいタスク",
    "task.new.desc": "気になることを書き留めましょう。優先順位はお任せください。",
    "task.name": "タスク名",
    "task.name.placeholder": "例: 歴史レポートを仕上げる",
    "task.description": "説明",
    "task.description.placeholder": "任意のメモ",
    "task.deadline": "期限",
    "task.priority": "優先度",
    "task.category": "カテゴリ",
    "task.workload": "所要時間（分）",
    "task.cancel": "キャンセル",
    "task.add": "追加",
    "task.edit": "タスクを編集",
    "task.edit.desc": "詳細を更新しサブタスクを管理します。",
    "task.save": "変更を保存",
    "task.subtasks": "サブタスク",
    "task.subtask.placeholder": "サブタスクを入力しEnter...",
    "task.subtask.add": "サブタスクを追加...",
    "task.subtask.count": "サブタスク",
    "task.mins": "分",
    "task.click.edit": "クリックで編集",
    "task.dbl.rename": "ダブルクリックで名前変更",

    "reschedule.title": "タスクを再調整",
    "reschedule.desc": "今週の残りの優先度を再計算します。",
    "reschedule.was": "旧期限",
    "reschedule.new": "新期限",
    "reschedule.pick": "新しい期限を選択",
    "reschedule.note": "今後3日間の予定が自動調整されます。",
    "reschedule.confirm": "再調整を確定",

    "activity.completed": "完了",
    "activity.created": "作成",
    "activity.updated": "更新",
    "activity.rescheduled": "再調整",
    "activity.progress": "進捗",
  },
};

export const DEFAULT_SUBTASKS: Record<Lang, Record<"School" | "Work", string[]>> = {
  vi: {
    School: ["Lập dàn ý", "Viết nội dung chính", "Rà soát & hoàn thiện"],
    Work: ["Chuẩn bị tài liệu", "Thực hiện công việc", "Báo cáo kết quả"],
  },
  en: {
    School: ["Outline structure", "Write main content", "Review & submit"],
    Work: ["Prepare materials", "Execute the work", "Report results"],
  },
  ja: {
    School: ["アウトラインを作成", "本文を書く", "見直して提出"],
    Work: ["資料を準備", "作業を実行", "結果を報告"],
  },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
}

const I18nContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang") as Lang | null;
      if (stored && (stored === "vi" || stored === "en" || stored === "ja")) {
        setLangState(stored);
      }
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (k: string) => dicts[lang][k] ?? dicts.en[k] ?? k,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback: works during SSR before provider mounts
    return {
      lang: "vi" as Lang,
      setLang: () => {},
      t: (k: string) => dicts.vi[k] ?? k,
    };
  }
  return ctx;
}
