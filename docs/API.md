# API

Tài liệu này định nghĩa convention API baseline cho AI Platform.

## 1. Base Path

```text
/api/v1
```

## 2. Resource Style

```text
GET    /api/v1/workspaces
POST   /api/v1/workspaces
GET    /api/v1/workspaces/:workspaceId
PATCH  /api/v1/workspaces/:workspaceId
DELETE /api/v1/workspaces/:workspaceId
```

## 3. Response Format

Success:

```json
{
  "data": {},
  "error": null,
  "meta": {}
}
```

Error:

```json
{
  "data": null,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "Permission denied",
    "details": {}
  },
  "meta": {
    "requestId": "req_xxx"
  }
}
```

## 4. Authentication

Client gửi Clerk session/token theo cơ chế được định nghĩa trong:

```text
docs/AUTH_RBAC.md
```

Backend luôn verify identity và authorization.

## 5. Workspace Context

Workspace-owned endpoint phải có workspace context rõ ràng.

Ưu tiên:

```text
/api/v1/workspaces/:workspaceId/...
```

Không tin workspace permission do frontend tự gửi.

## 6. Pagination

Baseline:

```text
limit
cursor
```

Response:

```json
{
  "data": [],
  "meta": {
    "nextCursor": null
  }
}
```

## 7. Streaming

Chat/Agent streaming ưu tiên SSE hoặc protocol streaming được chuẩn hóa riêng.

Event phải typed và versionable.

## 8. Request ID

Mỗi request nên có:

```text
requestId
```

để trace qua API, Agent Runtime, MCP và logs.

## 9. API Rules

- API contract phải typed.
- Không trả raw internal error.
- Không leak secret.
- Không trả DB model trực tiếp nếu contract khác domain entity.
- Breaking change phải version hoặc migrate có kiểm soát.
