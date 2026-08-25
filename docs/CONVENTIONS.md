# Conventions

Tài liệu này định nghĩa naming và code organization baseline.

## 1. File Naming

Backend:

```text
*.controller.ts
*.service.ts
*.repository.ts
*.schema.ts
*.types.ts
*.test.ts
```

Frontend:

```text
ComponentName.tsx
useSomething.ts
feature.api.ts
feature.store.ts
feature.types.ts
```

## 2. Package Boundary

```text
apps
-> packages

core package
-X-> apps
```

Không tạo circular dependency.

## 3. Shared Logic

Trước khi duplicate, kiểm tra:

```text
packages/app-core
packages/api-client
packages/auth
packages/shared
packages/ui-web
packages/ui-native
```

## 4. Imports

Ưu tiên package alias rõ ràng:

```text
@repo/ui-web
@repo/app-core
@repo/api-client
```

Không dùng relative import xuyên nhiều package boundary.

## 5. Scope

Không refactor ngoài task.

Nếu phát hiện vấn đề ngoài scope, report thay vì tự sửa.

## 6. TypeScript

- Ưu tiên explicit public types.
- Tránh `any` nếu không cần.
- Validation boundary phải dùng schema/runtime validation.
- External input luôn untrusted.

## 7. Documentation

Nếu thay đổi architecture/boundary, cập nhật file docs tương ứng.
