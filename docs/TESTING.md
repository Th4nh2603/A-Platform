# Testing

Tài liệu này định nghĩa testing baseline trước khi repo lớn.

## 1. Test Layers

```text
Unit
Integration
API
Agent Runtime
MCP
E2E
```

## 2. Baseline

```text
packages/*
-> unit tests

apps/api
-> integration/API tests

Agent Runtime
-> execution loop tests

MCP
-> mocked MCP server tests

Web/Admin
-> component + E2E critical flows

Desktop
-> smoke test Electron launch + auth bridge

Mobile
-> smoke test Expo app + navigation
```

## 3. Critical E2E

Ưu tiên:

```text
login
logout
workspace selection
chat send/receive
permission denial
desktop auth callback
```

## 4. Test Naming

```text
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx
```

Chọn một convention và giữ nhất quán.

## 5. CI Gate

Baseline CI:

```text
lint
typecheck
unit tests
build
critical integration tests
```

Không yêu cầu mọi test nặng chạy local trước mỗi thay đổi nhỏ.
