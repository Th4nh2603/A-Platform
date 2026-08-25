# Git Workflow

Tài liệu này định nghĩa quy trình Git/GitHub chuẩn cho AI Agent, Codex và developer khi làm việc trong repository `A-Platform`.

## 1. Mục tiêu

Git workflow phải đảm bảo:

```text
inspect first
verify before commit
stage exact files
avoid secrets
avoid unrelated changes
push safely
create PR when appropriate
```

Không được hiểu lệnh `upload repo`, `push repo`, `publish repo` hoặc `đưa code lên GitHub` là chạy ngay `git add . && git commit && git push`.

## 2. Repository Preflight

Trước mọi Git operation, kiểm tra:

```bash
git rev-parse --is-inside-work-tree
git status
git branch --show-current
git remote -v
git diff
git diff --staged
```

Kiểm tra thêm:

```text
.gitignore
.env
.env.local
API keys
credentials
private certificates
node_modules
dist
build artifacts
large generated files
```

Rule bắt buộc:

```text
NEVER PUSH SECRETS
```

## 3. Staging Rules

Chỉ stage file/path thuộc task hiện tại.

Đúng:

```bash
git add -- package.json pnpm-workspace.yaml tsconfig.json
git add -- apps/web
git add -- packages/config
```

Không dùng:

```bash
git add .
git add -A
git add --all
```

Sau khi stage phải review:

```bash
git diff --staged
```

## 4. Initial Publish

Khi local repository chưa có Git history hoặc remote là repository mới/rỗng:

```text
Project Local
   ↓
git init
   ↓
git branch -M main
   ↓
check .gitignore + secrets
   ↓
stage exact files
   ↓
review staged diff
   ↓
initial commit
   ↓
connect GitHub remote
   ↓
push main
```

Không force push.

## 5. Existing Repository

Baseline thông thường:

```text
main
  ↓
task branch
  ↓
change
  ↓
verify
  ↓
stage exact files
  ↓
commit
  ↓
push
  ↓
PR
  ↓
review / merge
```

Tuy nhiên nếu user **explicitly yêu cầu thao tác trực tiếp trên `main`**, được phép làm trực tiếp trên `main` sau khi kiểm tra scope, diff và rủi ro.

Không tự tạo branch nếu user đã yêu cầu rõ `main`.

## 6. One Task = One Scope

Khuyến nghị mặc định:

```text
1 task
= 1 focused change
= 1 branch nếu cần
= 1 focused commit hoặc nhóm commit nhỏ
= 1 PR nếu workflow dùng PR
```

Không trộn feature không liên quan.

## 7. Verification Before Commit

Chạy các command hiện có và phù hợp với scope.

Ví dụ:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Chỉ chạy command thực sự tồn tại trong repository/workspace tương ứng.

Nếu verification fail:

```text
Do not claim success.
```

## 8. Commit Convention

Dùng Conventional Commits:

```text
feat:
fix:
chore:
docs:
refactor:
test:
ci:
```

Ví dụ:

```text
chore: initialize pnpm monorepo
feat(web): initialize React application
feat(auth): add Clerk authentication
fix(desktop): handle auth callback
docs: add workspace architecture
```

Tránh message mơ hồ như `update files`, `changes`, `fix stuff`, `final`.

## 9. Push Rules

Trước push:

```bash
git status
git diff --staged
git log -1 --oneline
```

Không dùng `--force` trừ khi user yêu cầu rõ và hậu quả đã được kiểm tra.

## 10. Pull Request Rules

Nếu dùng PR:

```text
task branch
   ↓
PR
   ↓
main
```

PR phải có:

```text
focused scope
clear title
summary of changes
verification result
known issues if any
```

AI Agent tạo Draft PR mặc định trừ khi user yêu cầu khác.

Nếu đã có PR phù hợp, update PR hiện tại thay vì tạo duplicate.

## 11. Remote Already Contains Code

Nếu remote đã có history:

```text
fetch / inspect
  ↓
compare histories
  ↓
merge/rebase only when appropriate
```

Không tự động overwrite remote hoặc force push.

## 12. Documentation Update Rule

Tài liệu chính thức của project nằm trong:

```text
docs/
```

Nếu task thay đổi architecture, flow hoặc convention đã chốt, phải cập nhật file tài liệu tương ứng trong `docs/`.

Nếu thay đổi cách Agent đọc/routing tài liệu, cập nhật thêm:

```text
AGENTS.md
```

Nếu thay đổi roadmap/status:

```text
docs/ROADMAP.md
TASK_REPORT.md
```

## 13. Git Task Routing

Các task sau phải đọc file này:

```text
git
commit
push
publish
upload repo
branch
merge
pull request
PR
repository cleanup
```

## 14. Reporting

Sau Git operation, báo cáo tối thiểu:

```text
branch
commit SHA / message nếu có
remote
verification status
push status
PR status nếu có
known issues
```

Không báo đã push/merge thành công nếu chưa xác minh.