# AGENTS.md

Tài liệu này là rule chung cho AI Agent / Codex khi làm việc trong repository.

## Before Editing

1. Đọc `README.md`.
2. Xác định domain của task.
3. Đọc file tương ứng trong `docs/`.
4. Chỉ chỉnh file cần thiết cho task.
5. Không refactor ngoài phạm vi nếu không có lý do trực tiếp.

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


## Agent Runtime Tasks

Khi chỉnh execution loop, delegation, context, state, streaming, retry, timeout hoặc cancellation, đọc:

```text
docs/AGENT_RUNTIME.md
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
