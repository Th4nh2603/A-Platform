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
|   |
|   +-- web/
|   |
|   +-- admin/
|   |
|   +-- desktop/
|   |
|   +-- mobile/
|   |
|   +-- api/
|
+-- packages/
|   |
|   +-- design-tokens/
|   +-- theme/
|   +-- icons/
|   |
|   +-- ui-web/
|   +-- ui-native/
|   |
|   +-- app-core/
|   +-- api-client/
|   +-- auth/
|   +-- shared/
|   |
|   +-- agent-core/
|   +-- skill-core/
|   +-- mcp-core/
|
+-- skills/
|
+-- docs/
|   +-- ARCHITECTURE.md
|   +-- FRONTEND.md
|   +-- BACKEND.md
|   +-- AGENT.md
|   +-- MCP.md
|
+-- AGENTS.md
+-- README.md
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

Mục tiêu:

- cùng colors
- cùng typography
- cùng spacing
- cùng radius
- cùng icon
- cùng branding
- cùng component contract
- UX phù hợp từng platform

Mobile không phải Web thu nhỏ.

---

## 7. Nguyên tắc Agent

```text
Agent != Skill != Tool != MCP
```

Hiểu đơn giản:

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

Sub-agent không có module riêng.

Sub-agent vẫn là Agent.

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

MCP không thay thế:

- Agent Runtime
- Skill Engine
- LLM Router
- internal Agent orchestration

---

## 9. Documentation

Chi tiết kiến trúc được tách thành các file:

- `docs/ARCHITECTURE.md` — kiến trúc tổng thể và boundary
- `docs/FRONTEND.md` — UI, design system và cấu trúc 4 client app
- `docs/BACKEND.md` — backend API, runtime và infrastructure
- `docs/AGENT.md` — Agent, Sub-agent, Skill, Tool, Memory và orchestration
- `docs/MCP.md` — MCP Manager, Gateway, permission và integrations
- `docs/MCP_SERVERS.md` — quy chuẩn khai báo MCP Server, tool, risk và permission

---

## 10. Rule cho Developer và AI Agent

Trước khi chỉnh sửa code:

1. Đọc `AGENTS.md`.
2. Đọc tài liệu domain liên quan trong `docs/`.
3. Xác định đúng app / package cần sửa.
4. Không chỉnh code ngoài phạm vi task nếu không cần thiết.
5. Không duplicate business logic nếu có thể share.
6. Không duplicate UI component nếu shared component đã tồn tại.
7. Không hard-code design value nếu token đã tồn tại.
8. Không để frontend gọi trực tiếp MCP hoặc giữ LLM API key.
9. Các thao tác nguy hiểm phải đi qua permission / approval.
10. Khi thay đổi shared package phải kiểm tra ảnh hưởng tới các app liên quan.

---

## 11. Tài liệu nên đọc theo task

```text
Task UI / Frontend
-> README.md
-> AGENTS.md
-> docs/FRONTEND.md

Task Backend
-> README.md
-> AGENTS.md
-> docs/BACKEND.md

Task Agent / Skill
-> README.md
-> AGENTS.md
-> docs/AGENT.md

Task MCP core / Gateway
-> README.md
-> AGENTS.md
-> docs/MCP.md

Task thêm hoặc chỉnh MCP Server
-> README.md
-> AGENTS.md
-> docs/MCP.md
-> docs/MCP_SERVERS.md

Task thay đổi kiến trúc
-> README.md
-> AGENTS.md
-> docs/ARCHITECTURE.md
```


## Agent Runtime

Chi tiết execution engine:

```text
docs/AGENT_RUNTIME.md
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

`DATA_MODEL.md` là source of truth cho entity/schema chính.

`WORKSPACE.md` mô tả multi-workspace, ownership, member, invitation và tenant isolation.

## Deployment

```text
docs/DEPLOYMENT.md
```

Mô tả environments, Web/API deployment, migrations, queue, storage, Desktop/Mobile release và CI/CD.

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
