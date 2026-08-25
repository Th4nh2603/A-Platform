# Frontend

Tài liệu này mô tả kiến trúc Frontend và Design System cho 4 client application.

---

## 1. Các Client App

```text
apps/web
= Web App cho user

apps/admin
= Super Admin Web App

apps/desktop
= Electron + React

apps/mobile
= React Native + Expo
```

---

## 2. UI Strategy đã chốt

Sử dụng:

> Shared Design Tokens + `ui-web` + `ui-native`

Không dùng một universal component implementation cho cả DOM và React Native.

Không tạo design system riêng cho từng app.

---

## 3. Shared Design System

```text
packages/
├── design-tokens/
├── theme/
├── icons/
├── ui-web/
└── ui-native/
```

### `design-tokens`

Chứa:

```text
colors
typography
spacing
radius
shadows
sizing
breakpoints
motion
z-index
```

### `theme`

Semantic mapping:

```text
background.primary
background.secondary
text.primary
text.secondary
border.default
accent.primary
danger.background
```

### `icons`

Icon system dùng chung.

---

## 4. UI Web

```text
packages/ui-web/
├── components/
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Dialog/
│   ├── Modal/
│   ├── Tabs/
│   ├── Table/
│   ├── Badge/
│   ├── Avatar/
│   └── Tooltip/
├── layout/
│   ├── Sidebar/
│   ├── Header/
│   ├── AppShell/
│   └── ContentLayout/
└── feedback/
    ├── Toast/
    ├── Alert/
    ├── Skeleton/
    └── EmptyState/
```

Được dùng bởi:

```text
apps/web
apps/admin
apps/desktop
```

---

## 5. UI Native

```text
packages/ui-native/
├── components/
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Sheet/
│   ├── Tabs/
│   ├── Badge/
│   └── Avatar/
├── layout/
│   ├── Screen/
│   ├── Stack/
│   ├── SafeArea/
│   └── BottomSheetLayout/
└── feedback/
    ├── Toast/
    ├── Skeleton/
    └── EmptyState/
```

Chỉ dùng bởi:

```text
apps/mobile
```

---

## 6. Component Contract

Nếu cùng concept, API nên tương đồng.

Ví dụ:

```tsx
<Button
  variant="primary"
  size="md"
  disabled={false}
>
  Create Agent
</Button>
```

Web implementation:

```text
HTML button
```

Native implementation:

```text
React Native Pressable
```

---

## 7. Shared Business Logic

Không để mỗi app tự viết business logic.

Dùng:

```text
packages/app-core/
├── chat/
├── agents/
├── files/
├── skills/
├── mcp/
├── workspace/
├── knowledge/
└── settings/
```

Feature folder trong app chủ yếu giữ:

- screen composition
- navigation wiring
- platform-specific behavior
- layout adaptation

---

## 8. Shared API Client

```text
packages/api-client/
├── chat.ts
├── agents.ts
├── skills.ts
├── files.ts
├── knowledge.ts
├── mcp.ts
├── auth.ts
├── users.ts
└── admin.ts
```

Cả 4 app sử dụng cùng API client nếu backend contract giống nhau.

---

## 9. Desktop

Electron chỉ là shell / native bridge.

```text
apps/desktop/
├── electron/
│   ├── main/
│   ├── preload/
│   └── ipc/
└── renderer/
```

Renderer dùng:

```text
@repo/ui-web
@repo/design-tokens
@repo/theme
@repo/app-core
@repo/api-client
```

Native desktop capability:

- window controls
- system tray
- file picker
- filesystem
- notification
- keyboard shortcut
- auto update
- OS integration

---

## 10. Super Admin

Super Admin dùng cùng `ui-web`.

Được phép khác:

- navigation
- route
- workflow
- data density
- permission
- page composition

Không được tạo một design system riêng.

---

## 11. Mobile

Mobile không phải Web UI thu nhỏ.

Ví dụ Desktop:

```text
Sidebar | Conversation | Artifact Panel
```

Mobile có thể là:

```text
Conversation
  |
  +-- Files
  +-- Agent
  +-- Tools
       |
       v
  Bottom Sheet
```

Cùng Design Language nhưng layout khác.

---

## 12. Frontend Rules

1. Kiểm tra `ui-web` / `ui-native` trước khi tạo component mới.
2. Không hard-code color, radius, spacing nếu token đã tồn tại.
3. Web, Admin và Desktop phải ưu tiên reuse `ui-web`.
4. Mobile không import DOM component.
5. Component contract web/native nên tương đồng khi hợp lý.
6. Business logic ưu tiên đưa vào `app-core`.
7. API access ưu tiên qua `api-client`.
8. Không đưa secret vào frontend.
9. Không sửa shared token chỉ để fix một screen riêng.
10. Thay đổi shared component phải kiểm tra app bị ảnh hưởng.

## Authentication / Authorization

Chi tiết Login, Session, Workspace Role và RBAC:

```text
docs/AUTH_RBAC.md
```
