# CI/CD

Tài liệu này định nghĩa CI/CD foundation cho AI Platform và mở rộng các nguyên tắc deployment trong `docs/DEPLOYMENT.md`.

## 1. Mục tiêu

CI/CD được triển khai theo từng giai đoạn, phù hợp mức độ hoàn thiện của repository.

Không tạo workflow giả hoặc job chắc chắn thất bại chỉ để hoàn thiện cấu trúc sớm.

Baseline logic hiện tại:

```text
Pull Request / push main
        ↓
Install
        ↓
Lint
        ↓
Typecheck
```

Khi repository có test/build scripts ổn định, mở rộng thành:

```text
Install
  ↓
Lint
  ↓
Typecheck
  ↓
Unit Test
  ↓
Build
  ↓
Integration Test
```

## 2. CI Provider

Baseline:

```text
GitHub Actions
```

Workflow directory:

```text
.github/workflows/
```

Workflow đầu tiên dự kiến:

```text
.github/workflows/ci.yml
```

Implementation chính thức nằm trong Roadmap:

```text
Task 89 — GitHub Actions CI
```

## 3. CI Triggers

CI baseline khi được triển khai sẽ chạy:

```text
pull_request -> main
push -> main
```

Không deploy production từ pull request.

## 4. Runtime Versions

CI phải bám version khai báo trong repository.

Baseline hiện tại:

```text
Node.js 22.20.0
pnpm 10.30.3
```

`package.json` là source of truth cho `packageManager`.

## 5. Dependency Install

Dùng lockfile deterministic:

```bash
pnpm install --frozen-lockfile
```

CI không tự sửa `pnpm-lock.yaml`.

## 6. Foundation Checks

Ở foundation hiện tại, required checks về mặt logic:

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

Chưa bắt buộc `pnpm test` hoặc `pnpm build` cho toàn repo nếu scripts tương ứng chưa tồn tại ổn định.

## 7. Pull Request Policy

Khi workflow CI đã tồn tại, PR vào `main` nên yêu cầu:

```text
CI pass
no unresolved critical review issue
no known secret committed
scope matches task
```

Branch protection chỉ bật required checks thực sự tồn tại.

## 8. Branch / Main Strategy

Git flow chi tiết xem:

```text
docs/GIT_WORKFLOW.md
```

Mặc định có thể dùng task branch + PR.

Nếu user explicit yêu cầu thao tác trực tiếp trên `main`, Git workflow phải tuân yêu cầu đó và vẫn giữ verification/scope checks.

## 9. Concurrency & Cache

Khi triển khai CI:

- cancel run cũ khi có commit mới trên cùng branch/PR nếu phù hợp;
- cho phép pnpm cache;
- lockfile vẫn là source of truth.

## 10. Permissions

Baseline CI dùng principle of least privilege:

```yaml
permissions:
  contents: read
```

Không cấp write permission nếu job không cần.

## 11. Secrets

Không hard-code secret trong workflow.

Staging/production credentials phải nằm trong:

```text
GitHub Actions Secrets
GitHub Environments
hoặc deployment secret manager
```

Không expose secret qua logs, artifact, PR comment hoặc frontend bundle.

## 12. Environment Model

```text
development
staging
production
```

CI validation không đồng nghĩa deployment.

Future flow:

```text
PR
 ↓
CI
 ↓
merge main
 ↓
Deploy Staging
 ↓
Smoke Test
 ↓
Production Approval
 ↓
Deploy Production
```

## 13. Staging Deployment

Roadmap:

```text
Task 90 — Staging Deployment
```

Dự kiến workflow:

```text
.github/workflows/deploy-staging.yml
```

Flow:

```text
main
 ↓
Build Artifact
 ↓
Migration Staging if required
 ↓
Deploy
 ↓
Smoke Test
```

## 14. Production Deployment

Roadmap:

```text
Task 91 — Production Deployment
```

Dự kiến workflow:

```text
.github/workflows/deploy-production.yml
```

Production cần approval/policy trước deploy.

## 15. Database Migration

Roadmap:

```text
Task 92 — Migration Pipeline
```

Flow:

```text
Create Migration
 ↓
Local Test
 ↓
CI Validation
 ↓
Staging Migration
 ↓
Verify
 ↓
Production Migration
```

Ưu tiên backward-compatible migration.

## 16. Monorepo CI

Repository gồm:

```text
apps/*
packages/*
```

Giai đoạn đầu có thể lint/typecheck toàn repo.

Khi repo lớn, bổ sung affected/path-based execution; shared package change phải trigger các app phụ thuộc.

## 17. Desktop / Mobile Release

Roadmap:

```text
Task 99 — Desktop Packaging / Signing
Task 100 — Desktop Auto Update
Task 101 — Mobile Build / Release
```

Dự kiến workflow:

```text
release-desktop.yml
release-mobile.yml
```

Không tạo các workflow này trước khi app build/package ổn định.

## 18. Failure Policy

Nếu CI fail:

```text
Do not report task as fully verified.
Do not merge solely to bypass CI.
Inspect failing job.
Fix within task scope.
```

Failure ngoài scope phải được report rõ, không tự refactor lan rộng.

## 19. Documentation Update Rule

Thay đổi CI/CD behavior:

```text
update docs/CI_CD.md
```

Thay đổi deployment architecture:

```text
update docs/DEPLOYMENT.md
```

Thay đổi Git flow:

```text
update docs/GIT_WORKFLOW.md
```

Thay đổi thứ tự/scope task:

```text
update docs/ROADMAP.md
```

## 20. Current State

Hiện tại:

```text
docs/CI_CD.md                         ✅ policy đã có
.github/workflows/ci.yml              ❌ chưa implement
Task 89 — GitHub Actions CI           ⏳ future roadmap
Deploy staging / production workflows ❌ chưa implement
Desktop / Mobile release workflows    ❌ chưa implement
```

Đây là trạng thái chủ ý theo roadmap, không được báo workflow đã tồn tại khi repository chưa có file thực tế.