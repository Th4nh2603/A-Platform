# Task 03 — Web App Skeleton

Task ID: `03`

Phase: `Phase 1 — Foundation`

Status source of truth: `TASK_REPORT.md`

Roadmap source of truth: `docs/ROADMAP.md`

## Objective

Khởi tạo Web App foundation trong:

```text
apps/web
```

Web App dùng:

```text
React
TypeScript
Vite
```

Task này chỉ tạo một application skeleton có thể chạy, typecheck, lint và build ổn định trong monorepo hiện tại.

Không triển khai business feature trong Task 03.

## Required Reading

Trước khi chỉnh code, MUST read:

```text
AGENTS.md
docs/ROADMAP.md
TASK_REPORT.md
docs/ARCHITECTURE.md
docs/FRONTEND.md
docs/CONVENTIONS.md
docs/CONFIG.md
docs/TESTING.md
```

Đồng thời inspect config hiện có tại:

```text
packages/config
```

Không tạo config song song nếu shared config hiện tại đã đáp ứng nhu cầu.

## Preconditions

Xác nhận Task 01 và Task 02 đã hoàn thành trước khi triển khai.

Kiểm tra tối thiểu:

```text
pnpm workspace tồn tại
apps/web tồn tại
packages/config tồn tại
root lint script tồn tại
root typecheck script tồn tại
```

Nếu prerequisite bắt buộc bị thiếu hoặc hỏng, report rõ thay vì mở rộng scope sang task khác.

## Scope

Chỉ triển khai Web App skeleton trong `apps/web` và các thay đổi root tối thiểu thực sự cần để workspace nhận app.

Cấu trúc baseline mong muốn:

```text
apps/web/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Các directory chưa có implementation có thể giữ bằng file placeholder phù hợp nếu Git cần track directory.

Không tạo abstraction giả chỉ để lấp đầy mọi folder.

## Package Requirements

`apps/web/package.json` phải là private workspace package.

Tên package baseline:

```text
@repo/web
```

Dependencies tối thiểu cho Web skeleton:

```text
react
react-dom
```

Dev dependencies tối thiểu khi cần:

```text
vite
@vitejs/plugin-react
typescript types cho React nếu chưa được cung cấp phù hợp
```

Ưu tiên version tương thích với Node/pnpm và dependency baseline hiện tại của repository.

Không upgrade dependency root không liên quan chỉ để dùng version mới hơn.

## Shared Config

Phải reuse `@repo/config` từ Task 02.

Trước khi cấu hình TypeScript/ESLint, inspect exports hiện tại trong:

```text
packages/config/package.json
packages/config/tsconfig.react.json
packages/config/eslint.react.js
```

Yêu cầu:

```text
React TypeScript config
-> kế thừa / reuse shared config hiện có

ESLint
-> đi qua shared root/config strategy hiện có
```

Không copy nguyên shared TypeScript hoặc ESLint rules vào `apps/web`.

Nếu cần app-specific override, chỉ thêm override tối thiểu và giải thích lý do.

## Vite Setup

Tạo Vite config tối thiểu cho React.

Không thêm plugin không cần cho Task 03.

Không cấu hình proxy backend, auth callback, PWA, SSR, analytics hoặc production hosting trong task này.

Web app phải có dev server và production build hợp lệ.

## Application Entry

`src/main.tsx` chỉ chịu trách nhiệm bootstrap React app.

`src/App.tsx` chỉ cần render foundation screen đơn giản để xác nhận app hoạt động.

Ví dụ nội dung được phép:

```text
AI Platform
Web App Foundation
React + Vite
```

Không cần thiết kế dashboard thật.

Không cần mock product feature.

## Folder Boundaries

Baseline responsibility:

```text
src/app
= app composition / providers sau này

src/components
= component local chưa đủ điều kiện đưa vào shared UI

src/features
= feature modules

src/layouts
= app layouts

src/pages
= route-level pages

src/routes
= routing composition

src/styles
= app-level style entry / temporary foundation styles
```

Task 03 không bắt buộc phải có Router library nếu chưa có route thực tế cần điều hướng.

Không thêm React Router chỉ để tạo folder `routes`.

## Styling

Chỉ dùng styling tối thiểu để foundation screen hiển thị rõ ràng.

Không xây Design System trong Task 03 vì:

```text
Task 05 — Design Tokens
Task 06 — Web UI Package
```

Không tạo token architecture riêng trong `apps/web`.

Không hard-code một bộ theme lớn sẽ phải xóa ở Task 05/06.

## Scripts

`apps/web/package.json` nên có tối thiểu các script phù hợp:

```text
dev
build
typecheck
```

Có thể có `lint` nếu phù hợp với shared ESLint strategy hiện tại.

Không thay đổi root scripts ngoài phạm vi Task 03 nếu app có thể được verify bằng workspace command hiện có.

Task 14 mới chịu trách nhiệm chuẩn hóa root scripts tổng thể.

## Out of Scope

Task 03 MUST NOT implement:

```text
Clerk
login / signup
RBAC
Workspace
Database
Backend API business logic
API integration
Chat
Files
Knowledge / RAG
Agent
Sub-agent
Skill Engine
MCP
Super Admin app
Electron
Expo / Mobile
Design Tokens hoàn chỉnh
Shared Web UI package hoàn chỉnh
production deployment
GitHub Actions
```

Không triển khai Task 04 hoặc task sau khi Task 03 hoàn tất.

## Verification

Sau implementation, chạy các verification phù hợp từ repository root.

Baseline:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm --filter @repo/web build
```

Nếu package name thực tế khác vì repository đã có convention rõ hơn, dùng đúng package name đã được chốt và report lại.

Nếu `pnpm install` làm thay đổi lockfile do dependency Task 03, thay đổi đó thuộc scope và phải review.

Không claim Task 03 hoàn thành nếu một verification bắt buộc đang fail.

## Repository Review

Trước khi kết thúc:

```text
inspect git status
inspect diff thuộc Task 03
xác nhận không có secret
xác nhận không có file generated ngoài scope
xác nhận không implement Task 04+
```

Không tự commit/push/branch nếu user không yêu cầu Git operation trong prompt thực thi.

Nếu user yêu cầu làm trực tiếp trên `main`, tuân thủ yêu cầu đó và không tự tạo branch.

## Definition of Done

Task 03 chỉ được đánh dấu `Completed` khi:

```text
apps/web là React + TypeScript + Vite app hợp lệ
Web app reuse shared config từ Task 02
app có foundation screen tối thiểu
app có thể build production
root lint pass
root typecheck pass
workspace install pass
không có business feature ngoài scope
không có Task 04+ implementation
```

## TASK_REPORT Update

Chỉ sau khi toàn bộ Definition of Done và verification bắt buộc pass:

```text
TASK_REPORT.md
Task 03 — Web App Skeleton
Status -> Completed
```

Ghi rõ verification thực tế đã chạy.

Sau đó current task trong report có thể chuyển sang Task 04, nhưng **không tự triển khai Task 04**.

## Final Report Format

Khi Codex hoàn thành Task 03, final response phải báo ngắn gọn:

```text
Task 03 status
files created / changed
packages added
shared config reuse
verification commands + result
TASK_REPORT update status
known issues, nếu có
```

Nếu task chưa hoàn tất, report chính xác phần nào còn fail.

## Stop Condition

Dừng sau khi Task 03 được implement + verify + report.

Không tiếp tục:

```text
Task 04 — Super Admin Skeleton
```

trừ khi user yêu cầu riêng.