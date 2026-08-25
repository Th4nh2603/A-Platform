# Security

Tài liệu này định nghĩa security baseline.

## 1. Trust Boundary

Untrusted:

```text
browser input
mobile input
desktop renderer input
uploaded files
external MCP output
LLM output
```

Trusted runtime:

```text
backend
Electron main process
secured worker
MCP gateway
```

## 2. Secrets

Không để secret trong:

```text
frontend bundle
Git repository
Electron renderer
logs
URLs
```

## 3. Authentication

Theo:

```text
docs/AUTH_RBAC.md
```

Backend luôn verify authorization.

## 4. Workspace Isolation

Mọi workspace-owned query phải scope theo `workspaceId`.

Cross-workspace access mặc định deny.

## 5. MCP Security

Mọi MCP call đi qua:

```text
Tool Router
-> MCP Gateway
```

Gateway kiểm tra:

```text
permission
risk
approval
timeout
validation
audit
```

## 6. Prompt Injection

Không coi LLM output hoặc retrieved content là trusted instruction.

Tool permission không được thay đổi chỉ vì prompt yêu cầu.

## 7. File Security

- Validate file type/size.
- Không trust filename.
- Không cho path traversal.
- Filesystem tool phải giới hạn allowed root.

## 8. Electron

- Privileged logic ở main process.
- Renderer dùng preload/IPC contract.
- Không expose Node API tùy ý.
- OAuth mở system browser.

## 9. Rate Limiting

Áp dụng cho:

```text
auth-sensitive endpoints
LLM calls
tool calls
upload
expensive search
```

## 10. Audit

High-risk actions phải audit.

Không log credentials hoặc raw secrets.
