# Configuration

Tài liệu này định nghĩa configuration và environment baseline.

## 1. Environments

```text
development
staging
production
```

## 2. Env Files

Repository chỉ commit:

```text
.env.example
```

Không commit:

```text
.env
.env.local
production secrets
```

## 3. Baseline Variables

```text
NODE_ENV=

DATABASE_URL=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=

OBJECT_STORAGE_ENDPOINT=
OBJECT_STORAGE_BUCKET=

QUEUE_URL=
```

## 4. Public vs Secret

Public config:

```text
frontend-safe publishable values
API public URL
feature flags safe for client
```

Secret config:

```text
LLM API keys
Clerk secret
database credentials
MCP credentials
storage secret
```

Secret không được bundle vào frontend.

## 5. Shared Config

Nên có:

```text
packages/config/
```

cho typed configuration/schema.

## 6. Validation

App phải fail fast nếu required env bị thiếu.

Không để runtime chạy với config undefined rồi lỗi ngẫu nhiên.

## 7. Feature Flags

Feature flag có thể dùng cho:

```text
MCP
experimental Agent features
new UI
beta model provider
```

Không dùng feature flag để bypass security permission.
