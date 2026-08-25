# MCP

Tài liệu này mô tả cách MCP được sử dụng trong AI Platform.

---

## 1. Vai trò của MCP

MCP nằm ở lớp:

```text
Tool / Integration
```

Không dùng MCP để thay thế:

- Agent Runtime
- Skill Engine
- LLM Router
- internal orchestration

---

## 2. Luồng MCP

```text
Agent
  |
  v
Tool Router
  |
  v
MCP Gateway
  |
  v
MCP Client
  |
  v
MCP Server
  |
  v
External Service
```

---

## 3. MCP Core

```text
packages/mcp-core/
├── manager/
├── registry/
├── client/
├── gateway/
├── permissions/
├── discovery/
├── validation/
└── connections/
```

---

## 4. MCP Manager

Chịu trách nhiệm:

- quản lý MCP Server
- connect / disconnect
- health status
- capability discovery
- connection lifecycle

---

## 5. MCP Registry

Lưu metadata:

```text
server
tools
resources
prompts
status
permissions
assigned agents
```

---

## 6. MCP Gateway

Agent không gọi MCP Client trực tiếp.

Gateway xử lý:

- authentication
- authorization
- tool filtering
- schema validation
- approval
- rate limit
- timeout
- audit
- error normalization

---

## 7. Tool Permission

Sai:

```text
ALL AGENTS
  |
  v
ALL MCP TOOLS
```

Đúng:

```text
MCP Registry
    |
    v
Policy Engine
    |
    +-- Coding Agent
    +-- Research Agent
    +-- Review Agent
```

---

## 8. Approval

Ví dụ action:

```text
filesystem.delete("/project/database.db")
```

Gateway phải có thể đánh dấu:

```text
risk = high
approval = required
```

trước khi thực thi.

---

## 9. MCP Integrations

Ví dụ:

```text
GitHub MCP
Filesystem MCP
PostgreSQL MCP
Figma MCP
Internal API MCP
```

Agent chỉ nhìn thấy tool schema được phép.

---

## 10. MCP và Skill

Skill:

```text
Review Pull Request
```

có thể gọi:

```text
github.get_pull_request
github.get_diff
filesystem.read_file
```

Skill mô tả workflow.

MCP cung cấp capability.

---

## 11. MCP và Agent

Agent-to-Agent:

```text
internal runtime
```

Agent-to-External-Service:

```text
MCP
```

Đây là boundary mặc định.

---

## 12. MCP Rules

1. Agent không gọi MCP Client trực tiếp.
2. Mọi call đi qua Tool Router / MCP Gateway.
3. Permission filter theo Agent.
4. High-risk tool cần approval.
5. Credential chỉ tồn tại tại trusted runtime.
6. MCP Server không được quyết định business rule của app.
7. MCP integration phải có timeout và error handling.
8. Tool discovery không đồng nghĩa Agent được quyền gọi tool.

## Authentication / Authorization

Chi tiết Login, Session, Workspace Role và RBAC:

```text
docs/AUTH_RBAC.md
```

## MCP Persistence

Schema MCP Server, MCP Tool và Tool Permission:

```text
docs/DATA_MODEL.md
```

Workspace isolation:

```text
docs/WORKSPACE.md
```
