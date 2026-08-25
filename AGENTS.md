# AGENTS.md

Tài liệu này là rule chung cho AI Agent / Codex khi làm việc trong repository.

## Before Editing

1. Đọc `README.md` nếu tồn tại; nếu root `README.md` chưa có, dùng `docs/README.md` làm project overview.
2. Đọc `docs/ROADMAP.md` và xác định Task ID nếu công việc thuộc roadmap.
3. Đọc `TASK_REPORT.md` để biết trạng thái triển khai thực tế.
4. Xác định domain của task.
5. Đọc file tương ứng trong `docs/`.
6. Chỉ chỉnh file cần thiết cho task.
7. Không refactor ngoài phạm vi nếu không có lý do trực tiếp.
8. Không tự động triển khai task kế tiếp nếu user chỉ yêu cầu một task.

## Project Planning / Progress Routing

```text
Roadmap / Phase / Future Task / Task ID / Implementation Order
-> docs/ROADMAP.md

Current Progress / Completed Task / Verification / Current Task
-> TASK_REPORT.md
```

`docs/ROADMAP.md` là source of truth cho future scope và thứ tự task.

`TASK_REPORT.md` chỉ phản ánh implementation status thực tế.

## Documentation Routing

```text
Frontend / UI
-> docs/FRONTEND.md

Backend / API
-> docs/BACKEND.md

Agent / Skill
-> docs/AGENT.md

MCP core / Tool Integration
-> docs/MCP.md

MCP Server / Tool Permission
-> docs/MCP_SERVERS.md

Architecture
-> docs/ARCHITECTURE.md
```

## General Rules

- Không duplicate shared logic.
- Không duplicate UI component khi shared component đã tồn tại.
- Không hard-code design token nếu token đã tồn tại.
- Không để frontend giữ secret.
- Không để frontend gọi MCP trực tiếp.
- Không cấp toàn bộ tool cho mọi Agent.
- Sub-agent vẫn là Agent.
- Skill, Tool và MCP là các khái niệm khác nhau.
- Thay đổi shared package phải đánh giá ảnh hưởng tới các app sử dụng package đó.
- Giữ module nhỏ, rõ responsibility và dễ test.
- Khi task hoàn thành hoặc status thay đổi, cập nhật `TASK_REPORT.md` với đúng Task ID từ `docs/ROADMAP.md`.
- Không đánh dấu task Completed nếu verification bắt buộc chưa pass.

## Agent Foundation / Rules Tasks

Nếu task liên quan Agent architecture rule, Agent/Sub-agent contract, role, permission, delegation rule, context contract, memory scope, execution-state contract, approval/risk hoặc Agent error contract, MUST read:

```text
docs/ROADMAP.md
docs/AGENT.md
docs/AGENT_RUNTIME.md
```

Nếu liên quan permission / approval / MCP boundary, đọc thêm:

```text
docs/AUTH_RBAC.md
docs/MCP.md
docs/MCP_SERVERS.md
```

## Agent Runtime Tasks

Khi chỉnh execution loop, delegation implementation, context builder, state, streaming, retry, timeout, cancellation hoặc Sub-agent execution, đọc:

```text
docs/ROADMAP.md
docs/AGENT_RUNTIME.md
docs/AGENT.md
```

## Authentication / Login / RBAC Tasks

Nếu task liên quan Login, OAuth, Clerk, Session, RBAC, Workspace Membership, Super Admin, Desktop Deep Link hoặc PKCE, MUST read:

```text
docs/AUTH_RBAC.md
```

Auth UI:

```text
docs/AUTH_RBAC.md
docs/FRONTEND.md
```

Auth API:

```text
docs/AUTH_RBAC.md
docs/BACKEND.md
```

Agent / MCP permission:

```text
docs/AUTH_RBAC.md
docs/AGENT.md
docs/MCP.md
```

## Data Model Tasks

Nếu task liên quan database schema, entity, relation, migration, foreign key hoặc index, MUST read:

```text
docs/DATA_MODEL.md
```

## Workspace Tasks

Nếu task liên quan workspace, tenant, owner, member, invitation hoặc data isolation, MUST read:

```text
docs/WORKSPACE.md
docs/AUTH_RBAC.md
```

## Deployment Tasks

Nếu task liên quan deploy, CI/CD, environment, migration rollout, queue, worker, storage hoặc release, MUST read:

```text
docs/DEPLOYMENT.md
```

Nếu deploy liên quan database schema, đọc thêm:

```text
docs/DATA_MODEL.md
```

## Foundation Documentation Routing

API / Endpoint / Streaming:

```text
docs/API.md
```

Chat / Conversation / Message:

```text
docs/CHAT.md
```

Environment / Config / Feature Flag:

```text
docs/CONFIG.md
```

Error / Exception:

```text
docs/ERROR_HANDLING.md
```

Tests:

```text
docs/TESTING.md
```

Naming / Folder / Import / Code Convention:

```text
docs/CONVENTIONS.md
```

Security-sensitive changes:

```text
docs/SECURITY.md
```
