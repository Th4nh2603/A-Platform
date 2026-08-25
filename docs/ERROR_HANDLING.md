# Error Handling

Tài liệu này định nghĩa error convention chung.

## 1. Error Shape

```ts
type AppError = {
  code: string
  message: string
  details?: unknown
  requestId?: string
}
```

## 2. Baseline Codes

```text
AUTH_REQUIRED
SESSION_EXPIRED
PERMISSION_DENIED

WORKSPACE_NOT_FOUND
WORKSPACE_SUSPENDED

RESOURCE_NOT_FOUND
VALIDATION_ERROR
CONFLICT

AGENT_NOT_FOUND
AGENT_EXECUTION_FAILED

MCP_CONNECTION_ERROR
MCP_TIMEOUT
TOOL_NOT_FOUND

MODEL_ERROR
RATE_LIMITED

INTERNAL_ERROR
```

## 3. Rules

- Không leak stack trace ra client production.
- Không leak token/secret.
- Error phải có stable `code`.
- Message có thể thay đổi, code dùng cho app logic.
- Mọi critical error nên có `requestId`.
- Retry chỉ áp dụng cho retryable errors.
