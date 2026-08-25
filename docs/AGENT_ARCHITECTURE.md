# Agent Architecture

Tài liệu này mô tả kiến trúc Agent, Sub-agent, Skill, Tool và Memory của AI Platform.

---

## 1. Khái niệm

```text
Agent != Skill != Tool != MCP
```

### Agent

AI worker có:

- instruction
- model
- context
- skills
- tools
- memory
- permission

### Sub-agent

Sub-agent vẫn là Agent.

Khác biệt chủ yếu nằm ở role và cách được orchestrator gọi.

Ví dụ:

```text
Main Agent
├── Coding Agent
├── Research Agent
└── Review Agent
```

---

## 2. Agent Core

```text
packages/agent-core/
├── runtime/
├── context/
├── state/
├── delegation/
├── orchestration/
├── memory/
└── result/
```

---

## 3. Agent Model

Ví dụ conceptual model:

```ts
Agent {
  id
  name
  type
  instruction
  model
  skills
  tools
  permissions
}
```

`type` có thể gồm:

```text
main
subagent
```

Không tạo domain model riêng cho Sub-agent nếu không cần.

---

## 4. Agent-to-Agent

Agent giao tiếp với Agent khác thông qua internal runtime.

```text
Main Agent
  |
  v
Task Delegation
  |
  +-- Coding Agent
  +-- Research Agent
  +-- Review Agent
```

Không bắt buộc dùng MCP cho Agent-to-Agent.

---

## 5. Skill

Skill mô tả:

> Agent phải làm công việc như thế nào.

Skill content nằm trong:

```text
skills/
├── code-review/
│   └── SKILL.md
├── research/
│   └── SKILL.md
└── frontend-design/
    └── SKILL.md
```

Skill Engine nằm trong:

```text
packages/skill-core/
```

Skill Engine chịu trách nhiệm:

- discovery
- loading
- parsing
- validation
- execution context

---

## 6. Tool

Tool mô tả:

> Agent có thể làm gì.

Ví dụ:

```text
github.get_issue
github.create_pull_request
filesystem.read_file
filesystem.write_file
web.search
database.query
```

Tool có thể đến từ:

- internal tool
- MCP Server
- service adapter

---

## 7. Memory

Khuyến nghị tách:

```text
conversation memory
workspace memory
user preference memory
agent working memory
```

Không trộn tất cả memory vào một store không có scope.

---

## 8. Agent Permission

Không cấp toàn bộ tool cho mọi Agent.

Ví dụ:

```text
Coding Agent
├── filesystem.read
├── filesystem.write
├── github.search_code
└── github.create_pr

Research Agent
├── web.search
├── web.fetch
└── document.search

Review Agent
├── filesystem.read
├── github.read
└── git.diff
```

---

## 9. Orchestration

Luồng:

```text
User Request
    |
    v
Main Agent
    |
    v
Task Planning
    |
    +-- execute directly
    |
    +-- delegate sub-agent
    |
    +-- call skill
    |
    +-- call tool
```

---

## 10. LLM Router

Model do Agent Runtime quản lý.

```text
Agent Runtime
  |
  v
LLM Router
  |
  +-- OpenAI
  +-- Anthropic
  +-- Gemini
  +-- Local Model
```

Không bắt buộc đưa LLM call qua MCP.

---

## 11. Agent Rules

1. Sub-agent vẫn là Agent.
2. Skill không phải Tool.
3. MCP không phải Agent Runtime.
4. Tool permission phải filter theo Agent.
5. Agent-to-Agent dùng internal runtime.
6. Không cấp toàn bộ tool mặc định.
7. Các action nguy hiểm cần approval.
8. Skill phải có scope rõ ràng.
9. Memory phải có scope.
10. Agent core không phụ thuộc UI.

---

## Agent Runtime

Chi tiết execution lifecycle và runtime engine xem:

```text
docs/AGENT_RUNTIME.md
```

## Authentication / Authorization

Chi tiết Login, Session, Workspace Role và RBAC:

```text
docs/AUTH_RBAC.md
```
