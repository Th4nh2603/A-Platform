# Backend

Tài liệu này mô tả cấu trúc Backend API và Runtime.

---

## 1. Backend App

```text
apps/api/
└── src/
    ├── modules/
    ├── runtime/
    └── infrastructure/
```

---

## 2. Modules

```text
modules/
├── auth/
├── users/
├── workspaces/
├── chat/
├── agents/
├── skills/
├── mcp/
├── files/
├── knowledge/
├── models/
└── usage/
```

Mỗi module quản lý business capability riêng.

---

## 3. Runtime

```text
runtime/
├── conversation-runtime/
├── agent-runtime/
├── orchestration/
├── tool-router/
├── model-router/
└── approval/
```

### Conversation Runtime

Quản lý:

- conversation state
- message lifecycle
- streaming
- context assembly

### Agent Runtime

Quản lý:

- Agent execution
- Sub-agent delegation
- Agent context
- Agent state
- Agent result

### Tool Router

Quản lý tool selection và chuyển tool call tới implementation phù hợp.

### Model Router

Quản lý model provider:

```text
OpenAI
Anthropic
Gemini
Local Model
Custom Provider
```

---

## 4. Infrastructure

```text
infrastructure/
├── database/
├── queue/
├── storage/
├── cache/
├── logging/
└── telemetry/
```

Không để infrastructure logic trộn vào domain module nếu có thể tránh.

---

## 5. API Boundary

Frontend gọi:

```text
@repo/api-client
```

API xử lý:

- validation
- authentication
- authorization
- business rules
- runtime call
- response mapping

---

## 6. Security

Backend giữ:

- LLM credentials
- MCP credentials
- database credentials
- privileged integration tokens

Không gửi secret xuống client.

---

## 7. Error Handling

Mỗi layer nên trả error có cấu trúc.

Ví dụ:

```text
code
message
details
requestId
```

Không leak stack trace hoặc secret ra client.

---

## 8. Backend Rules

1. Module có ownership rõ ràng.
2. Runtime không phụ thuộc UI.
3. Infrastructure không chứa business rule.
4. Secret chỉ tồn tại tại trusted runtime.
5. Tool action nguy hiểm phải qua approval/policy.
6. API contract nên được typed và dùng chung qua shared package khi phù hợp.

## Authentication / Authorization

Chi tiết Login, Session, Workspace Role và RBAC:

```text
docs/AUTH_RBAC.md
```

## Data Model / Workspace / Deployment

Database model:

```text
docs/DATA_MODEL.md
```

Workspace isolation:

```text
docs/WORKSPACE.md
```

Deployment và migration:

```text
docs/DEPLOYMENT.md
```
