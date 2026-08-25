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
use task branches
push safely
create PR when appropriate
```

Không được hiểu lệnh `upload repo`, `push repo`, `publish repo` hoặc `đưa code lên GitHub` là chạy ngay `git add . && git commit && git push`.

## 2. Detect Repository State

Trước mọi Git operation, kiểm tra:

```bash
git rev-parse --is-inside-work-tree
git status
git branch --show-current
git remote -v
```

Nếu chưa phải Git repository:

```bash
git init
git branch -M main
```

Sau đó tiếp tục preflight.

## 3. Run Project Locally vs Initialize Git

Hai khái niệm này phải tách biệt:

```text
Initialize Git Repository
-> git init

Run Project Locally
-> pnpm install
-> pnpm dev
```

Nếu root scripts chưa có `pnpm dev`, chạy script app cụ thể theo `package.json` hiện tại.

## 4. Git Preflight

Trước commit/push, luôn kiểm tra:

```bash
git status
git diff
git diff --staged
git branch --show-current
git remote -v
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

## 5. Staging Rules

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

Sau khi stage:

```bash
git diff --staged
```

Phải review staged diff trước commit.

## 6. Initial Publish Flow

Dùng khi repository local chưa có Git history hoặc GitHub remote là repository mới/rỗng.

Flow:

```text
Project Local
   ↓
git init
   ↓
git branch -M main
   ↓
check .gitignore
   ↓
secret check
   ↓
git status / git diff
   ↓
stage exact files
   ↓
review staged diff
   ↓
initial commit
   ↓
connect/create GitHub remote
   ↓
push main
```

Ví dụ:

```bash
git init
git branch -M main

git add -- <explicit-paths>
git diff --staged

git commit -m "chore: initialize project"

git remote add origin <repository-url>
git remote -v

git push -u origin main
```

Không force push.

## 7. Existing Repository Flow

Sau initial publish, không làm task trực tiếp trên `main` nếu không có lý do đặc biệt.

Baseline:

```text
main
  ↓
create task branch
  ↓
change
  ↓
verify
  ↓
stage exact files
  ↓
review staged diff
  ↓
commit
  ↓
push branch
  ↓
PR
  ↓
review / merge
```

Ví dụ branch:

```text
chore/task-02-typescript-config
feat/task-03-web-foundation
feat/auth-web-login
fix/desktop-auth-callback
```

## 8. One Task = One Branch

Khuyến nghị:

```text
1 task
= 1 branch
= 1 focused commit hoặc nhóm commit nhỏ
= 1 PR
```

Không trộn nhiều feature không liên quan vào cùng branch.

## 9. Verification Before Commit

Chạy các command hiện có và phù hợp với scope.

Foundation baseline:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Chỉ chạy command thực sự tồn tại trong `package.json` hoặc workspace tương ứng.

Nếu test/build fail:

```text
Do not claim success.
```

Nếu user vẫn yêu cầu push branch lỗi, phải báo rõ verification đang fail.

## 10. Commit Convention

Dùng Conventional Commits đơn giản:

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
test(api): add workspace permission tests
```

Không dùng message mơ hồ như:

```text
update files
changes
fix stuff
final
```

## 11. Push Rules

Trước push:

```bash
git status
git diff --staged
git log -1 --oneline
```

Push branch:

```bash
git push -u origin <branch-name>
```

Không dùng `--force` trừ khi user yêu cầu rõ ràng và hậu quả đã được kiểm tra.

## 12. Pull Request

Với repository đã tồn tại:

```text
feature/task branch
   ↓
PR
   ↓
main
```

PR phải:

```text
focused scope
clear title
summary of changes
verification result
known issues if any
```

AI Agent nên tạo Draft PR mặc định, trừ khi user yêu cầu PR ready for review.

Nếu đã có PR phù hợp cho branch, update PR hiện tại thay vì tạo duplicate.

## 13. Remote Already Contains Code

Nếu remote đã có commit/history, không overwrite.

Flow:

```text
fetch remote
  ↓
compare histories
  ↓
merge/rebase only when appropriate
```

Không tự động chạy:

```bash
git push --force
```

Nếu local và remote có unrelated histories hoặc conflict lớn, dừng destructive operation và báo trạng thái.

## 14. Documentation Update Rule

Tài liệu chính thức của project nằm trong:

```text
docs/
```

Nếu task thay đổi architecture, flow hoặc convention đã được chốt, phải cập nhật file tài liệu tương ứng trong `docs/`.

Nếu thay đổi cách Agent đọc/routing tài liệu, cập nhật thêm:

```text
AGENTS.md
```

## 15. Git Task Routing

Các lệnh sau đều được coi là Git/GitHub task:

```text
git
commit
push
publish
upload repo
upload repository
đưa code lên GitHub
branch
merge
pull request
PR
```

Khi gặp các task này, phải đọc:

```text
docs/GIT_WORKFLOW.md
```

## 16. Reporting

Sau Git publish operation, báo cáo:

```text
branch
commit SHA / commit message
remote
verification status
push status
PR link/status nếu có
known issues
```

Không báo "đã push thành công" nếu chưa xác minh push thành công.
