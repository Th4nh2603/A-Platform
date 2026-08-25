# CI/CD

Tài liệu này định nghĩa CI/CD foundation cho AI Platform và mở rộng các nguyên tắc deployment trong `docs/DEPLOYMENT.md`.

---

## 1. Mục tiêu

CI/CD phải được triển khai theo từng giai đoạn, phù hợp với mức độ hoàn thiện của repository.

Không tạo workflow giả hoặc job chắc chắn thất bại chỉ để hoàn thiện cấu trúc sớm.

Baseline hiện tại:

```text
Pull Request / push main
        |
        v
Install
        |
        v
Lint
        |
        v
Typecheck
```

Khi repository có test/build scripts ổn định, mở rộng thành:

```text
Install
  |
  v
Lint
  |
  v
Typecheck
  |
  v
Unit Test
  |
  v
Build
  |
  v
Integration Test
```

---

## 2. CI Provider

Baseline:

```text
GitHub Actions
```

Workflow directory:

```text
.github/workflows/
```

Workflow đầu tiên:

```text
.github/workflows/ci.yml
```

---

## 3. CI Triggers

CI baseline chạy khi:

```text
pull_request -> main
push -> main
```

Không deploy production từ pull request.

---

## 4. Runtime Versions

CI phải bám theo version đã khai báo trong repository.

Hiện tại baseline:

```text
Node.js 22.20.0
pnpm 10.30.3
```

`package.json` là source of truth cho `packageManager`.

Khi thay đổi version Node/pnpm, phải cập nhật CI cùng task.

---

## 5. Dependency Install

CI dùng lockfile và phải cài deterministic:

```bash
pnpm install --frozen-lockfile
```

Không để CI tự ý sửa `pnpm-lock.yaml`.

---

## 6. Current Required Checks

Ở foundation phase hiện tại, required checks về mặt logic là:

```text
install
lint
typecheck
```

Commands:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
```

Chưa bắt buộc:

```text
pnpm test
pnpm build
```

vì repository chưa có test/build scripts chung ổn định.

Khi Task tương ứng bổ sung scripts này, CI phải được mở rộng trong cùng hoặc task kế tiếp.

---

## 7. Pull Request Policy

PR vào `main` phải:

```text
CI pass
no unresolved critical review issue
no known secret committed
scope matches task
```

Khuyến nghị branch protection sau khi CI ổn định:

```text
require pull request before merge
require status checks
block force push to main
block branch deletion for main
```

Không bật required check chưa tồn tại.

---

## 8. Branch Strategy

Theo `docs/GIT_WORKFLOW.md`:

```text
main
  |
  +-- feat/...
  +-- fix/...
  +-- chore/...
  +-- docs/...
  +-- ci/...
```

Mỗi task độc lập nên có branch riêng.

Không phát triển feature mới trực tiếp trên `main` sau initial repository setup.

---

## 9. Concurrency

CI nên cancel run cũ khi có commit mới trên cùng branch/PR.

Mục tiêu:

```text
new commit
   |
   +-- cancel obsolete CI run
   |
   +-- run latest commit
```

Điều này giảm thời gian và tài nguyên CI.

---

## 10. Caching

Cho phép cache package manager để tăng tốc:

```text
pnpm cache
```

Lockfile vẫn là source of truth.

Cache không được làm thay đổi dependency resolution.

---

## 11. Permissions

CI mặc định dùng principle of least privilege.

Baseline workflow chỉ cần:

```yaml
permissions:
  contents: read
```

Không cấp write permission cho CI nếu job không cần.

Deployment workflow sau này phải tách permission riêng.

---

## 12. Secrets

Không hard-code secret trong workflow.

Production/staging credentials phải nằm trong:

```text
GitHub Actions Secrets
GitHub Environments
hoặc deployment secret manager
```

Không expose secret qua:

```text
echo
logs
artifact
PR comment
frontend bundle
```

---

## 13. Environment Model

Deployment environments baseline:

```text
development
staging
production
```

CI validation không đồng nghĩa deployment.

Flow tương lai:

```text
PR
 |
 v
CI
 |
 v
merge main
 |
 v
Deploy Staging
 |
 v
Smoke Test
 |
 v
Production Approval
 |
 v
Deploy Production
```

---

## 14. Staging Deployment

Chưa triển khai workflow staging cho đến khi có ít nhất một deployable app/API.

Khi sẵn sàng, file dự kiến:

```text
.github/workflows/deploy-staging.yml
```

Baseline flow:

```text
main
  |
  v
Build Artifact
  |
  v
Migration Staging if required
  |
  v
Deploy
  |
  v
Smoke Test
```

Không dùng production credentials cho staging.

---

## 15. Production Deployment

Chưa triển khai workflow production ở foundation phase.

File dự kiến:

```text
.github/workflows/deploy-production.yml
```

Production phải có explicit approval/policy trước deploy.

Recommended flow:

```text
Verified Artifact
   |
   v
Production Approval
   |
   v
Migration
   |
   v
Deploy
   |
   v
Health Check
   |
   +-- healthy -> complete
   |
   +-- unhealthy -> rollback / forward-fix policy
```

---

## 16. Database Migration Policy

Migration không chạy trên PR against production.

Flow:

```text
Create Migration
  |
  v
Local Test
  |
  v
CI Validation
  |
  v
Staging Migration
  |
  v
Verify
  |
  v
Production Migration
```

Ưu tiên backward-compatible migration.

Chi tiết schema xem:

```text
docs/DATA_MODEL.md
```

Chi tiết deployment xem:

```text
docs/DEPLOYMENT.md
```

---

## 17. Monorepo CI

Repository gồm:

```text
apps/*
packages/*
```

Foundation phase có thể chạy lint/typecheck toàn repo vì codebase còn nhỏ.

Khi repo lớn, bổ sung affected/path-based execution.

Ví dụ:

```text
packages/ui-web changed
        |
        +-- web
        +-- admin
        +-- desktop renderer
```

Không optimize path filtering quá sớm nếu làm workflow khó hiểu.

---

## 18. Desktop Release

Chưa tạo Desktop release workflow ở foundation phase.

Khi Electron app đã package được, dự kiến:

```text
.github/workflows/release-desktop.yml
```

Flow:

```text
tag / manual release
  |
  v
build
  |
  v
package
  |
  v
sign
  |
  v
artifact
  |
  v
release
```

---

## 19. Mobile Release

Chưa tạo Mobile release workflow ở foundation phase.

Khi Expo/mobile build ổn định, dự kiến:

```text
.github/workflows/release-mobile.yml
```

Flow:

```text
build
sign
validate
submit
release
```

---

## 20. Workflow Naming

Recommended names:

```text
CI
Deploy Staging
Deploy Production
Release Desktop
Release Mobile
```

File names:

```text
ci.yml
deploy-staging.yml
deploy-production.yml
release-desktop.yml
release-mobile.yml
```

---

## 21. Failure Policy

Nếu CI fail:

```text
Do not report task as fully verified.
Do not merge solely to bypass CI.
Inspect failing job.
Fix within task scope.
```

Nếu failure không liên quan task hiện tại, report rõ và không tự refactor ngoài scope.

---

## 22. Documentation Update Rule

Khi thay đổi CI/CD architecture hoặc workflow behavior:

```text
update docs/CI_CD.md
```

Nếu thay đổi deployment architecture:

```text
update docs/DEPLOYMENT.md
```

Nếu thay đổi Git branch / commit / PR flow:

```text
update docs/GIT_WORKFLOW.md
```

---

## 23. Current Foundation State

Hiện tại phải có:

```text
docs/CI_CD.md
.github/workflows/ci.yml
```

`ci.yml` chỉ chạy:

```text
install
lint
typecheck
```

Các workflow sau chưa tạo cho tới khi có implementation thật:

```text
deploy-staging.yml
deploy-production.yml
release-desktop.yml
release-mobile.yml
```

Đây là deliberate scope, không phải thiếu sót.
