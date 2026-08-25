# Deployment

Tài liệu này mô tả deployment architecture, environments, migration, queue, storage và CI/CD của AI Platform.

---

## 1. Mục tiêu

Deployment phải hỗ trợ:

```text
Web App
Super Admin
Backend API
Agent Runtime
Workers / Queue
Database
Object Storage
Desktop Release
Mobile Release
```

với environment rõ ràng:

```text
development
staging
production
```

---

## 2. Deployment Units

Baseline:

```text
apps/web
-> Web deployment

apps/admin
-> Admin Web deployment

apps/api
-> Backend API deployment

worker
-> background jobs / long-running processing

apps/desktop
-> packaged desktop releases

apps/mobile
-> iOS / Android releases
```

---

## 3. Runtime Architecture

```text
               Internet
                   |
          +--------+--------+
          |                 |
          v                 v
       Web App          Admin App
          |                 |
          +--------+--------+
                   |
                   v
                API
                   |
        +----------+----------+
        |          |          |
        v          v          v
     Database    Queue      Storage
                   |
                   v
                 Worker
                   |
                   v
        Agent / MCP / Indexing
```

---

## 4. Environment Strategy

Ba environment baseline:

```text
development
staging
production
```

Mỗi environment phải có:

```text
separate database
separate secrets
separate storage namespace
separate Clerk environment/config
separate MCP credentials
separate queue
```

Không dùng production credentials cho development.

---

## 5. Environment Variables

Không commit `.env` thật.

Repository có thể chứa:

```text
.env.example
```

Ví dụ:

```text
DATABASE_URL=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

OBJECT_STORAGE_ENDPOINT=
OBJECT_STORAGE_BUCKET=

QUEUE_URL=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

Tất cả production secret phải nằm trong secret manager / deployment platform.

---

## 6. Web Deployment

```text
apps/web
```

Deployment yêu cầu:

```text
build
static assets
runtime config
API base URL
Clerk public config
```

Không đưa server secret vào browser bundle.

---

## 7. Admin Deployment

```text
apps/admin
```

Admin có thể deploy riêng domain/subdomain:

```text
admin.example.com
```

Backend vẫn verify:

```text
platformRole = super_admin
```

Admin URL không phải security boundary.

---

## 8. API Deployment

```text
apps/api
```

Backend API cần:

```text
database access
queue access
object storage
LLM provider credentials
Clerk secret
MCP credentials / secret references
logging
telemetry
```

API phải stateless ở mức process nếu có thể để scale horizontally.

Execution state dài hạn phải persist ra database/queue thay vì chỉ giữ RAM.

---

## 9. Worker / Queue

Background jobs dùng cho:

```text
file parsing
knowledge indexing
embedding generation
long-running Agent task
scheduled cleanup
usage aggregation
email/invitation
retryable integration jobs
```

Không chạy mọi long-running task trong HTTP request lifecycle.

Architecture:

```text
API
 |
 v
Queue
 |
 v
Worker
```

---

## 10. Queue Job Baseline

Job metadata:

```text
jobId
workspaceId
type
payloadReference
status
attempt
createdAt
startedAt
completedAt
```

Status:

```text
queued
running
completed
failed
cancelled
```

Retry phải có:

```text
max attempts
backoff
dead-letter strategy
```

---

## 11. Database

Primary database baseline:

```text
PostgreSQL
```

Database phải tách theo environment.

Production yêu cầu:

```text
backups
point-in-time recovery if available
connection pooling
migration discipline
monitoring
```

---

## 12. Database Migration

Migration phải version-controlled.

Flow:

```text
Schema Change
   |
   v
Create Migration
   |
   v
Test Locally
   |
   v
Apply Staging
   |
   v
Verify
   |
   v
Apply Production
```

Không chỉnh production schema bằng thao tác tay nếu tránh được.

---

## 13. Migration Compatibility

Ưu tiên backward-compatible migration.

Ví dụ:

```text
1. add nullable column
2. deploy code supporting both states
3. backfill
4. enforce constraint
5. remove old field later
```

Tránh migration phá vỡ API đang chạy.

---

## 14. Object Storage

Dùng object storage cho:

```text
uploaded files
generated artifacts
exports
attachments
possibly logs/archive
```

Database chỉ lưu:

```text
metadata
storage key
checksum
status
```

Không lưu binary lớn trực tiếp trong primary relational database nếu không cần.

---

## 15. Knowledge Storage

Knowledge pipeline có thể dùng:

```text
Object Storage
+
Primary Database
+
Vector Store
```

Flow:

```text
File Upload
   |
   v
Object Storage
   |
   v
Processing Job
   |
   v
Knowledge Document
   |
   v
Chunks
   |
   v
Embeddings
   |
   v
Vector Store
```

---

## 16. Cache

Cache có thể dùng cho:

```text
session-related derived data
workspace settings
Agent configuration
rate limit
short-lived tool metadata
```

Không dùng cache làm source of truth cho permission lâu dài.

---

## 17. MCP Deployment

MCP Server có thể:

```text
run local to trusted runtime
run as remote service
run per workspace
run shared with tenant isolation
```

Production phải định nghĩa rõ:

```text
network access
credential scope
workspace isolation
timeout
health check
audit
```

Không expose internal MCP Server public nếu không cần.

---

## 18. Desktop Deployment

Desktop App:

```text
Electron + React
```

Release pipeline cần:

```text
build renderer
package Electron
code signing
artifact generation
release channel
auto-update metadata
```

Platforms:

```text
Windows
macOS
Linux
```

Có thể rollout theo phase, không bắt buộc hỗ trợ đủ 3 ngay từ đầu.

---

## 19. Desktop Update Channels

Recommended:

```text
stable
beta
dev
```

Production user mặc định:

```text
stable
```

Auto-update phải verify signed package/update metadata nếu platform tooling hỗ trợ.

---

## 20. Mobile Deployment

Mobile:

```text
React Native + Expo
```

Release targets:

```text
iOS
Android
```

Pipeline:

```text
build
sign
test
submit
release
```

Environment config không được hard-code secret vào bundle.

---

## 21. CI Pipeline

Baseline CI:

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

PR không nên deploy production trực tiếp.

---

## 22. CD Pipeline

Recommended:

```text
main branch
   |
   v
Build Artifact
   |
   v
Deploy Staging
   |
   v
Smoke Test
   |
   v
Approval / Policy
   |
   v
Deploy Production
```

Có thể tự động hóa dần.

---

## 23. Monorepo Change Detection

Vì dự án monorepo:

```text
apps/web
apps/admin
apps/api
apps/desktop
apps/mobile
packages/*
```

CI nên chỉ build/test các app bị ảnh hưởng nếu toolchain hỗ trợ.

Nhưng shared package change phải trigger dependent apps.

Ví dụ:

```text
packages/ui-web
-> web
-> admin
-> desktop renderer
```

---

## 24. Release Versioning

Có thể dùng:

```text
semantic versioning
```

đặc biệt cho:

```text
desktop
mobile
shared packages nếu publish
```

Web/API có thể dùng deployment version/build ID.

---

## 25. Rollback

Production deployment phải có rollback strategy.

Web/API:

```text
previous artifact
previous container/image
```

Database:

```text
prefer forward-fix
```

Không assume mọi migration có thể rollback an toàn.

---

## 26. Health Checks

API health:

```text
/api/health
```

Có thể chia:

```text
liveness
readiness
```

Check:

```text
process alive
database reachable
queue reachable
critical dependencies
```

Không đưa secret vào health response.

---

## 27. Observability

Production cần:

```text
structured logs
requestId
workspaceId when applicable
executionId
latency
error rate
token usage
MCP errors
queue failures
```

Không log:

```text
access token
password
API secret
raw credential
```

---

## 28. Deployment Security

1. Secret nằm trong secret manager.
2. Production DB không public nếu không cần.
3. Principle of least privilege.
4. Separate environment credentials.
5. Admin frontend không phải security boundary.
6. MCP network exposure tối thiểu.
7. File storage dùng scoped access.
8. Signed desktop artifacts nếu có thể.
9. Mobile signing key bảo vệ riêng.
10. CI secrets chỉ cấp cho job cần thiết.

---

## 29. Backup

Production baseline:

```text
database backup
object storage durability/versioning if supported
configuration backup
critical metadata backup
```

Restore phải được test định kỳ.

---

## 30. Disaster Recovery

Cần biết:

```text
what data can be lost?
how much downtime acceptable?
how to restore?
who performs recovery?
```

RPO/RTO chưa cần chốt sớm nhưng architecture không nên ngăn khả năng recovery.

---

## 31. Deployment Documentation Routing

Task liên quan:

```text
deploy
CI
CD
environment
migration
queue
worker
storage
release
rollback
production
staging
```

MUST read:

```text
docs/DEPLOYMENT.md
```

Database schema change:

```text
docs/DATA_MODEL.md
docs/DEPLOYMENT.md
```

Desktop release:

```text
docs/FRONTEND.md
docs/DEPLOYMENT.md
```

MCP production deployment:

```text
docs/MCP.md
docs/MCP_SERVERS.md
docs/DEPLOYMENT.md
```

---

## 32. Baseline đã chốt

Environments:

```text
development
staging
production
```

Primary deployment units:

```text
web
admin
api
worker
desktop
mobile
```

Backend infrastructure:

```text
PostgreSQL
Queue
Object Storage
```

Deployment principle:

```text
versioned
repeatable
observable
rollback-aware
environment-isolated
```
