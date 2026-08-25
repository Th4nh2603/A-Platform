# AI Platform

AI Platform là hệ thống AI Chatbot / AI Workspace đa nền tảng, hỗ trợ Chat, Agent, Sub-agent, Skill, MCP, Files, Knowledge và các workflow AI mở rộng.

Mục tiêu của dự án là xây dựng một nền tảng AI có thể chạy trên Web, Desktop và Mobile, đồng thời giữ chung kiến trúc, business logic và design language giữa các ứng dụng.

---

## 1. Ứng dụng trong hệ thống

Dự án gồm 4 client application chính:

```text
apps/
├── web/          # Web App cho user
├── admin/        # Web App dành cho Super Admin
├── desktop/      # Desktop App - Electron + React
└── mobile/       # Mobile App - React Native + Expo
```

Ngoài ra:

```text
apps/api/
```

là backend API và Agent Runtime của hệ thống.

---

## 2. Công nghệ baseline

```text
Web App
React

Super Admin Web App
React

Desktop App
Electron + React

Mobile App
React Native + Expo

Backend
Node.js / TypeScript

Architecture
Monorepo
```

---

## 3. Kiến trúc tổng quan

```text
User
  |
  v
Client App
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
  +-- Main Agent
  |     |
  |     +-- Coding Agent
  |     +-- Research Agent
  |     +-- Review Agent
  |
  +-- Skill Engine
  |
  +-- LLM Router
  |
  v
Tool Router
  |
  v
MCP Gateway
  |
  v
MCP Server
  |
  v
External Service
```

Các khái niệm chính:

```text
Workspace
  -> Agent
      -> Sub-agent
          -> Skill
              -> Tool
                  -> MCP
```

---

## 4. Cấu trúc thư mục

```text
ai-platform/
|
+-- apps/
|   +-- web/
|   +-- admin/
|   +-- desktop/
|   +-- mobile/
|   +-- api/
|
+-- packages/
|   +-- design-tokens/
|   +-- theme/
|   +-- icons/
|   +-- ui-web/
|   +-- ui-native/
|   +-- app-core/
|   +-- api-client/
|   +-- auth/
|   +-- shared/
|   +-- agent-core/
|   +-- skill-core/
|   +-- mcp-core/
|
+-- skills/
|
+-- docs/
|   +-- ROADMAP.md
|   +-- ARCHITECTURE.md
|   +-- FRONTEND.md
|   +-- BACKEND.md
|   +-- AGENT_ARCHITECTURE.md
|   +-- AGENT_RUNTIME.md
|   +-- MCP.md
|   +-- MCP_SERVERS.md
|   +-- GIT_WORKFLOW.md
|   +-- CI_CD.md
|   +-- DEPLOYMENT.md
|
+-- AGENTS.md
+-- TASK_REPORT.md
+-- package.json
+-- pnpm-workspace.yaml
```

---

## 5. Trách nhiệm chính

```text
apps/web
= Web App cho user

apps/admin
= Super Admin Web App

apps/desktop
= Electron shell + React renderer

apps/mobile
= React Native + Expo

apps/api
= Backend API + Agent Runtime
```

Shared packages:

```text
packages/design-tokens
= nguồn UI primitive chung

packages/theme
= semantic theme

packages/icons
= icon system dùng chung

packages/ui-web
= UI dùng bởi Web + Admin + Desktop

packages/ui-native
= UI dành cho Mobile

packages/app-core
= business logic dùng chung

packages/api-client
= shared API client

packages/auth
= auth contract và platform adapter

packages/shared
= types, schemas, constants, utilities

packages/agent-core
= Agent / Sub-agent runtime

packages/skill-core
= Skill Engine

packages/mcp-core
= MCP integration
```

---

## 6. Nguyên tắc UI

Dự án sử dụng:

> Shared Design Tokens + `ui-web` + `ui-native`

Không tạo 4 design system riêng.

```text
                 Design System
                       |
           +-----------+-----------+
           |                       |
        ui-web                 ui-native
           |                       |
     +-----+------+                |
     |     |      |                |
    Web  Admin  Desktop          Mobile
```

Mobile không phải Web thu nhỏ.

---

## 7. Nguyên tắc Agent

```text
Agent != Skill != Tool != MCP
```

```text
Agent
= AI worker

Sub-agent
= Agent được Agent khác giao nhiệm vụ

Skill
= hướng dẫn Agent thực hiện công việc

Tool
= hành động Agent có thể gọi

MCP
= chuẩn kết nối Tool / Data / External Service
```

Sub-agent vẫn là Agent.

Kiến trúc Agent xem:

```text
docs/AGENT_ARCHITECTURE.md
```

Execution runtime xem:

```text
docs/AGENT_RUNTIME.md
```

---

## 8. Nguyên tắc MCP

MCP nằm ở integration layer.

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
```

MCP không thay thế Agent Runtime, Skill Engine, LLM Router hoặc internal Agent orchestration.

---

## 9. Documentation

Tài liệu chính:

- `docs/ROADMAP.md` — source of truth cho future scope, phase và Task ID
- `TASK_REPORT.md` — trạng thái implementation thực tế
- `docs/ARCHITECTURE.md` — kiến trúc tổng thể và boundary
- `docs/FRONTEND.md` — UI, design system và cấu trúc client app
- `docs/BACKEND.md` — backend API, runtime và infrastructure
- `docs/AGENT_ARCHITECTURE.md` — Agent, Sub-agent, Skill, Tool, Memory và orchestration
- `docs/AGENT_RUNTIME.md` — execution lifecycle và runtime engine
- `docs/MCP.md` — MCP Manager, Gateway, permission và integrations
- `docs/MCP_SERVERS.md` — MCP Server, tool, risk và permission
- `docs/GIT_WORKFLOW.md` — Git/GitHub workflow
- `docs/CI_CD.md` — CI/CD policy
- `docs/DEPLOYMENT.md` — deployment architecture

---

## 10. Rule cho Developer và AI Agent

Trước khi chỉnh sửa code:

1. Đọc `AGENTS.md`.
2. Đọc `docs/ROADMAP.md` nếu task thuộc roadmap.
3. Đọc `TASK_REPORT.md` để biết implementation status.
4. Đọc tài liệu domain liên quan trong `docs/`.
5. Xác định đúng app/package cần sửa.
6. Không chỉnh ngoài phạm vi task nếu không cần thiết.
7. Không duplicate business logic hoặc UI component nếu đã có shared implementation.
8. Không hard-code design value nếu token đã tồn tại.
9. Không để frontend gọi trực tiếp MCP hoặc giữ LLM API key.
10. Các thao tác nguy hiểm phải đi qua permission / approval.

---

## 11. Tài liệu nên đọc theo task

```text
Task UI / Frontend
-> AGENTS.md
-> docs/ROADMAP.md
-> docs/FRONTEND.md

Task Backend
-> AGENTS.md
-> docs/ROADMAP.md
-> docs/BACKEND.md

Task Agent / Sub-agent / Skill
-> AGENTS.md
-> docs/ROADMAP.md
-> docs/AGENT_ARCHITECTURE.md
-> docs/AGENT_RUNTIME.md khi liên quan execution

Task MCP
-> AGENTS.md
-> docs/MCP.md
-> docs/MCP_SERVERS.md

Task Git / GitHub
-> AGENTS.md
-> docs/GIT_WORKFLOW.md

Task CI/CD / Deploy
-> AGENTS.md
-> docs/CI_CD.md
-> docs/DEPLOYMENT.md

Task thay đổi kiến trúc
-> AGENTS.md
-> docs/ARCHITECTURE.md
```

## Authentication & RBAC

```text
docs/AUTH_RBAC.md
```

Chứa Login, Clerk, Session, Workspace Role, Super Admin và Desktop OAuth/PKCE flow.

## Data & Workspace

```text
docs/DATA_MODEL.md
docs/WORKSPACE.md
```

## Foundation Docs

```text
docs/API.md
docs/CHAT.md
docs/CONFIG.md
docs/ERROR_HANDLING.md
docs/TESTING.md
docs/CONVENTIONS.md
docs/SECURITY.md
```

Các file này chốt convention nền móng trước khi repository lớn.
