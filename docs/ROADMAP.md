# AI Platform Roadmap

Tài liệu này là **source of truth cho kế hoạch triển khai tổng thể** của AI Platform.

`ROADMAP.md` trả lời:

```text
Dự án cần triển khai những gì?
Thứ tự các phase là gì?
Task ID nào thuộc phase nào?
Dependency chính giữa các phần là gì?
```

Trạng thái thực tế của từng task **không được quản lý tại đây**.

Trạng thái triển khai phải xem tại:

```text
TASK_REPORT.md
```

---

## 1. Quy ước Roadmap

- Mỗi task có một Task ID cố định.
- Không đổi Task ID sau khi task đã được dùng trong `TASK_REPORT.md`, commit, PR hoặc tài liệu khác.
- Có thể bổ sung task mới nếu scope dự án thay đổi, nhưng phải cập nhật cả roadmap và report mapping.
- Một task nên đủ nhỏ để Codex / AI Agent có thể triển khai, verify và review độc lập.
- Không triển khai task ở phase sau nếu dependency bắt buộc ở phase trước chưa tồn tại, trừ khi task đó chỉ là documentation / contract / rule.
- `ROADMAP.md` định nghĩa scope tương lai; `TASK_REPORT.md` định nghĩa trạng thái thực tế.
- Nếu task có implementation spec tại `docs/tasks/`, spec đó là hướng dẫn chi tiết cho đúng Task ID và không được tự mở rộng sang task khác.

---

# PHASE 1 — FOUNDATION

Mục tiêu: tạo monorepo, shared config và skeleton cơ bản cho toàn bộ platform.

```text
Task 01 — Initialize Monorepo Foundation
Task 02 — Shared TypeScript + ESLint Config
Task 03 — Web App Skeleton
Task 04 — Super Admin Skeleton
Task 05 — Design Tokens
Task 06 — Web UI Package
Task 07 — Desktop Electron Skeleton
Task 08 — Mobile Expo Skeleton
Task 09 — Native UI Package
Task 10 — Backend API Skeleton
Task 11 — Shared API Client
Task 12 — Shared Core Packages
Task 13 — Environment Configuration
Task 14 — Root Scripts
Task 15 — Foundation Smoke Test
```

Detailed implementation spec hiện có:

```text
Task 03 — Web App Skeleton
-> docs/tasks/TASK_03_WEB_APP.md
```

Exit criteria:

```text
all apps/packages có skeleton hợp lệ
shared config hoạt động
lint/typecheck chạy được ở root
foundation smoke test pass
```

---

# PHASE 2 — AGENT FOUNDATION / RULES

Mục tiêu: chốt rule, contract và boundary của Agent trước khi triển khai runtime thực tế.

Phase này **không yêu cầu Agent Runtime hoàn chỉnh**.

```text
Task 16 — Agent Architecture Rules
Task 17 — Agent / Sub-agent Contract
Task 18 — Agent Role Definitions
Task 19 — Skill / Tool / MCP Boundary
Task 20 — Agent Permission Model
Task 21 — Delegation Rules
Task 22 — Context Contract
Task 23 — Memory Scope Rules
Task 24 — Execution State Contract
Task 25 — Approval / Risk Policy
Task 26 — Agent Error Contract
Task 27 — Agent Documentation & Routing
```

Các rule chính phải chốt được:

```text
Agent != Skill != Tool != MCP
Sub-agent vẫn là Agent
Agent-to-Agent dùng internal runtime
Tool permission phải filter theo Agent + Workspace + Environment
High-risk action phải hỗ trợ approval
Memory phải có scope
Delegation phải có parent/child execution relationship
```

Tài liệu liên quan:

```text
docs/AGENT_ARCHITECTURE.md hoặc tài liệu Agent architecture hiện hành
docs/AGENT_RUNTIME.md
docs/AUTH_RBAC.md
docs/MCP.md
docs/MCP_SERVERS.md
docs/ERROR_HANDLING.md
```

Exit criteria:

```text
Agent/Sub-agent contract rõ ràng
role và permission rõ ràng
delegation rule rõ ràng
context/memory/execution contracts rõ ràng
Codex biết đọc đúng tài liệu khi làm Agent task
```

---

# PHASE 3 — DATA / AUTH / WORKSPACE

Mục tiêu: xây nền dữ liệu, identity, session, tenant isolation và authorization.

```text
Task 28 — Database + ORM Foundation
Task 29 — Core Data Models
Task 30 — Shared Auth Package
Task 31 — Clerk Web Authentication
Task 32 — Workspace + Membership
Task 33 — RBAC / Permission Guards
Task 34 — Super Admin Authentication
Task 35 — Desktop OAuth + PKCE + Deep Link
Task 36 — Mobile Authentication
Task 37 — Auth / Workspace Integration Tests
```

Tài liệu liên quan:

```text
docs/DATA_MODEL.md
docs/AUTH_RBAC.md
docs/WORKSPACE.md
docs/SECURITY.md
```

---

# PHASE 4 — CHAT / FILES / KNOWLEDGE

Mục tiêu: xây conversation layer, streaming, file storage và RAG foundation.

```text
Task 38 — Conversation + Message Models
Task 39 — Chat API
Task 40 — Streaming Protocol
Task 41 — Web Chat UI
Task 42 — Chat History
Task 43 — File Upload
Task 44 — Object Storage
Task 45 — Knowledge Document Pipeline
Task 46 — Chunking + Embeddings
Task 47 — Vector Search
Task 48 — RAG Retrieval
Task 49 — Chat + RAG Integration
```

Tài liệu liên quan:

```text
docs/CHAT.md
docs/API.md
docs/DATA_MODEL.md
docs/BACKEND.md
```

---

# PHASE 5 — AGENT RUNTIME

Mục tiêu: implement Agent system thật dựa trên contract đã chốt ở Phase 2.

```text
Task 50 — Agent Domain Model
Task 51 — Agent Runtime Skeleton
Task 52 — LLM Router
Task 53 — Context Builder
Task 54 — Memory Manager
Task 55 — Tool Router
Task 56 — Main Agent
Task 57 — Delegation Manager
Task 58 — Sub-agent Execution
Task 59 — Coding Agent
Task 60 — Research Agent
Task 61 — Review Agent
Task 62 — Approval / Pause / Resume
Task 63 — Retry / Timeout / Cancellation
Task 64 — Agent Execution Trace
Task 65 — Agent Runtime Integration Tests
```

Dependency chính:

```text
Agent Contract
   ↓
Agent Domain Model
   ↓
Agent Runtime
   ↓
LLM Router + Context + Memory + Tool Router
   ↓
Main Agent
   ↓
Delegation Manager
   ↓
Sub-agent Execution
   ↓
Coding / Research / Review Agent
```

Sub-agent được chia thành hai lớp:

```text
Phase 2 — định nghĩa rule / contract
Phase 5 — implement execution thật
```

Tài liệu liên quan:

```text
docs/AGENT_ARCHITECTURE.md hoặc tài liệu Agent architecture hiện hành
docs/AGENT_RUNTIME.md
docs/DATA_MODEL.md
docs/ERROR_HANDLING.md
```

---

# PHASE 6 — SKILLS / MCP

Mục tiêu: triển khai Skill Engine và integration layer qua MCP.

```text
Task 66 — Skill Core
Task 67 — Skill Discovery + Loader
Task 68 — Skill Assignment
Task 69 — MCP Core
Task 70 — MCP Registry
Task 71 — MCP Gateway
Task 72 — MCP Permission Engine
Task 73 — Filesystem MCP
Task 74 — GitHub MCP
Task 75 — Web / Search MCP
Task 76 — MCP Approval Integration
Task 77 — MCP Health + Audit
Task 78 — MCP Management UI
```

Tài liệu liên quan:

```text
docs/MCP.md
docs/MCP_SERVERS.md
docs/AGENT_RUNTIME.md
docs/AUTH_RBAC.md
```

---

# PHASE 7 — PRODUCT / ADMIN / OPERATIONS

Mục tiêu: hoàn thiện các màn hình và capability quản trị / vận hành sản phẩm.

```text
Task 79 — Workspace Settings
Task 80 — Agent Management UI
Task 81 — Skill Management UI
Task 82 — MCP Management UI
Task 83 — File / Knowledge UI
Task 84 — Usage Tracking
Task 85 — Admin Dashboard
Task 86 — Audit Logs
Task 87 — Feature Flags
Task 88 — Error / Operations Dashboard
```

---

# PHASE 8 — PRODUCTION READINESS

Mục tiêu: đưa hệ thống tới trạng thái có thể deploy, monitor, rollback và release an toàn.

```text
Task 89 — GitHub Actions CI
Task 90 — Staging Deployment
Task 91 — Production Deployment
Task 92 — Migration Pipeline
Task 93 — Observability
Task 94 — Logging / Metrics / Tracing
Task 95 — Rate Limiting
Task 96 — Security Hardening
Task 97 — Backup / Recovery
Task 98 — Full E2E Test
Task 99 — Desktop Packaging / Signing
Task 100 — Desktop Auto Update
Task 101 — Mobile Build / Release
Task 102 — Production Smoke Test
```

Tài liệu liên quan:

```text
docs/DEPLOYMENT.md
docs/CI_CD.md nếu tồn tại
docs/SECURITY.md
docs/TESTING.md
```

---

# Roadmap Summary

```text
Phase 1   Foundation                  Task 01–15
Phase 2   Agent Foundation / Rules    Task 16–27
Phase 3   Data / Auth / Workspace     Task 28–37
Phase 4   Chat / Files / Knowledge    Task 38–49
Phase 5   Agent Runtime               Task 50–65
Phase 6   Skills / MCP                Task 66–78
Phase 7   Product / Admin / Operations Task 79–88
Phase 8   Production Readiness        Task 89–102
```

Tổng baseline:

```text
102 tasks
8 phases
```

---

# TASK_REPORT Mapping

`TASK_REPORT.md` phải tham chiếu roadmap này.

Ví dụ:

```text
Roadmap source: docs/ROADMAP.md
Current Phase: Phase 1 — Foundation
Current Task: Task 03 — Web App Skeleton
Overall Progress: 2 / 102 tasks completed
```

Khi hoàn thành task:

1. Không sửa scope roadmap chỉ để khớp implementation.
2. Cập nhật `TASK_REPORT.md` với Task ID tương ứng.
3. Ghi verification thực tế.
4. Nếu scope thay đổi thật sự, cập nhật `ROADMAP.md` và tài liệu domain liên quan.
5. Không đánh dấu task Completed nếu verification bắt buộc chưa pass.

---

# Rule cho Codex / AI Agent

Trước khi bắt đầu task mới:

```text
1. Read AGENTS.md
2. Read docs/ROADMAP.md
3. Locate current Task ID
4. Read TASK_REPORT.md
5. Read docs/tasks/<TASK_SPEC>.md nếu Task ID có detailed spec
6. Read domain docs required by that task
7. Implement only the requested task scope
8. Run required verification
9. Update TASK_REPORT.md only when task status actually changes
```

Không tự động triển khai task kế tiếp nếu user chỉ yêu cầu một task.
