## Các thay đổi

### 1. Bỏ tên "Alex"
- Trong `src/routes/index.tsx`: greeting "Good morning, Alex" → chỉ còn "Chào buổi sáng" / "Good morning" / "おはようございます" (theo ngôn ngữ).
- Rà soát các nơi khác có hard-code "Alex" (AppShell sidebar, avatar label) và bỏ.

### 2. Tự sinh subtask khi tạo task
- Trong `src/lib/tasks.ts`: thêm hàm `generateDefaultSubtasks(name, category)` trả về 2–3 subtask chung chung theo category:
  - **School**: "Lập dàn ý", "Viết nội dung chính", "Rà soát & nộp"
  - **Work**: "Chuẩn bị tài liệu", "Thực hiện công việc", "Báo cáo & hoàn tất"
- Trong `src/hooks/use-tasks.ts` `addTask`: nếu `subtasks` không được truyền vào (hoặc rỗng), tự gọi `generateDefaultSubtasks` để gán.
- `AddTaskDialog` giữ nguyên — subtask được sinh tự động ở tầng hook.

### 3. Bỏ "score" hiển thị trên mỗi task
- Trong `src/components/TaskCard.tsx`: xoá phần badge/text hiển thị `priorityScore`. Giữ logic sort trong `sortTasks` (không hiển thị nhưng vẫn dùng để xếp thứ tự).

### 4. Giảm category còn 2 (School, Work)
- `src/lib/tasks.ts`: `type Category = "School" | "Work"`.
- `AddTaskDialog`: SelectItem chỉ còn School / Work; default `category = "School"`.
- `tasks.tsx` `CATEGORIES` array: `["All", "School", "Work"]`.
- `analytics.tsx`: vòng lặp workload chỉ còn 2 category.
- `mock-data.ts`: map mọi task `Project / Internship / Personal` → `Work` (hoặc School nếu hợp lý) để dữ liệu mock vẫn hoạt động.

### 5. Đa ngôn ngữ (VN mặc định, EN, JP) + nút chuyển
- Tạo `src/lib/i18n.tsx`:
  - `LanguageProvider` + `useT()` hook, lưu language trong `localStorage` (`lang` key), mặc định `vi`.
  - Object `translations = { vi: {...}, en: {...}, ja: {...} }` chứa toàn bộ key UI (nav, greetings, nhãn nút, filter, dialog text, category, priority, empty state, v.v.).
- Bọc `<LanguageProvider>` trong `src/routes/__root.tsx`.
- Tạo `src/components/LanguageSwitcher.tsx`: dropdown nhỏ với 3 lựa chọn 🇻🇳 VI / 🇬🇧 EN / 🇯🇵 JA, đặt ở header trong `AppShell`.
- Thay text cứng ở các màn (index, tasks, calendar, analytics, activity) và component (AppShell nav, AddTaskDialog, EditTaskDialog, TaskCard, PriorityBadge, ProgressOverview, RecommendationCard, WeeklyChart label) bằng `t("key")`.
- Default subtask templates cũng có 3 phiên bản ngôn ngữ — generate theo language hiện tại lúc tạo task.

### Ghi chú kỹ thuật
- Không đụng backend (app frontend-only, mock data).
- Hydration: `LanguageProvider` đọc localStorage trong `useEffect` để tránh mismatch SSR — render bằng default `vi` ở server, sau đó hydrate sang lựa chọn user.
- Giữ nguyên cấu trúc routes, chỉ thêm `i18n.tsx` và `LanguageSwitcher.tsx`.

Bạn duyệt plan này thì mình bắt tay làm nhé?