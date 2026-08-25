# Architecture

Tài liệu này mô tả boundary và kiến trúc tổng thể của AI Platform.

---

## 1. Kiến trúc cấp cao

```text
Client Applications
       |
       v
      API
       |
       v
Conversation Runtime
       |
       v
Agent Runtime
       |
       +-- Skill Engine
       +-- Memory
       +-- LLM Router
       |
       v
Tool Router
       |
       v
MCP Gateway
       |
       v
External Integrations
```

---

## 2. Client Applications

```text
apps/web
apps/admin
apps/desktop
apps/mobile
```

Các app chỉ chịu trách nhiệm:

- UI
- navigation
- user interaction
- platform-specific behavior
- gọi backend thông qua shared API client

Client không chịu trách nhiệm:

- Agent orchestration
- MCP execution
- privileged filesystem operations ngoài platform bridge
- LLM secret
- backend business rules

---

## 3. Backend

```text
apps/api
```

Backend chịu trách nhiệm:

- API
- authentication validation
- workspace data
- Agent Runtime
- Skill Engine integration
- model routing
- tool routing
- MCP Gateway
- audit
- storage
- logging

---

## 4. Shared Packages

```text
packages/
├── design-tokens/
├── theme/
├── icons/
├── ui-web/
├── ui-native/
├── app-core/
├── api-client/
├── auth/
├── shared/
├── agent-core/
├── skill-core/
└── mcp-core/
```

Mỗi package phải có một trách nhiệm rõ ràng.

Không tạo circular dependency giữa các package.

---

## 5. Dependency Direction

Ưu tiên dependency một chiều:

```text
apps
  |
  v
shared packages
  |
  v
core packages
```

Không để:

```text
package core
  -> import trực tiếp từ app
```

Ví dụ không được:

```text
packages/agent-core
  -> apps/web
```

---

## 6. Data Flow

```text
User
  |
  v
Client
  |
  v
API Client
  |
  v
Backend API
  |
  v
Agent Runtime
  |
  v
LLM / Tool / MCP
  |
  v
Result
  |
  v
Client
```

---

## 7. Cross-platform Strategy

UI:

```text
design-tokens
theme
icons
    |
    +-- ui-web
    |     |
    |     +-- web
    |     +-- admin
    |     +-- desktop
    |
    +-- ui-native
          |
          +-- mobile
```

Business logic:

```text
app-core
   |
   +-- web
   +-- admin
   +-- desktop
   +-- mobile
```

---

## 8. Kiến trúc Agent

```text
Main Agent
   |
   +-- Coding Agent
   +-- Research Agent
   +-- Review Agent
```

Agent-to-Agent:

```text
Internal Agent Runtime
```

Agent-to-Tool:

```text
Tool Router
  -> MCP Gateway
  -> MCP Server
```

---

## 9. Security Boundary

Frontend không giữ:

- LLM API key
- MCP credentials
- database credentials
- privileged service secrets

Các action nguy hiểm phải xử lý tại trusted runtime.

---

## 10. Nguyên tắc thay đổi kiến trúc

Khi thêm module mới:

1. Xác định ownership.
2. Xác định dependency direction.
3. Tránh duplicate responsibility.
4. Ưu tiên interface rõ ràng.
5. Cập nhật tài liệu nếu boundary thay đổi.

## Authentication Boundary

```text
Client
  |
  v
Clerk
  |
  v
Backend API
  |
  v
Internal User
  |
  +-- Platform Role
  +-- Workspace Membership
  +-- Resource Permission
  +-- Agent / MCP / Tool Permission
```

Desktop:

```text
Electron
  |
  v
System Browser
  |
  v
Clerk / Google
  |
  v
Backend Callback
  |
  v
One-Time Code
  |
  v
Deep Link
  |
  v
PKCE Exchange
  |
  v
Desktop Session
```

Chi tiết:

```text
docs/AUTH_RBAC.md
```

## Data & Tenant Boundary

```text
Workspace
= tenant boundary
```

Mọi resource nghiệp vụ chính phải gắn với:

```text
workspaceId
```

Chi tiết schema:

```text
docs/DATA_MODEL.md
```

Chi tiết multi-workspace:

```text
docs/WORKSPACE.md
```

## Deployment Boundary

Chi tiết deployment, environment, queue, storage và CI/CD:

```text
docs/DEPLOYMENT.md
```
