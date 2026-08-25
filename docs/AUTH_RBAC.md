# Authentication & RBAC

Tài liệu này mô tả Authentication, Login, Session, Workspace Membership, RBAC và authorization boundary của AI Platform.

---

## 1. Mục tiêu

```text
Authentication
= xác định user là ai

Authorization
= user được phép làm gì

Workspace Membership
= user thuộc workspace nào

RBAC
= role của user trong workspace

Agent / MCP Permission
= user hoặc Agent được phép dùng capability nào
```

Auth Provider baseline:

```text
Clerk
```

Clerk chịu trách nhiệm chính cho:

```text
Identity
Authentication
Session
OAuth Provider
Email Verification
Password Reset
```

Database của hệ thống chịu trách nhiệm cho:

```text
Platform Role
Workspace Role Mapping
Workspace Policy
Agent Permission
MCP Permission
Tool Permission
Resource Permission
```

---

## 2. Applications

Auth phải hỗ trợ 4 client app:

```text
apps/web
apps/admin
apps/desktop
apps/mobile
```

Baseline:

```text
Web
= React + Clerk React SDK

Super Admin
= React + Clerk React SDK

Desktop
= Electron + React
= system browser OAuth flow
= PKCE
= deep link callback
= secure session storage

Mobile
= React Native + Expo
= Clerk Expo SDK
```

---

## 3. Login Features

Baseline:

```text
Email + Password
Google Login
Forgot Password
Reset Password
Email Verification
Logout
Session Restore
Session Expired
Remember Session
```

Có thể bổ sung sau:

```text
GitHub Login
Apple Login
Passkeys
MFA
Enterprise SSO
```

---

## 4. Login Flow — Web

```text
User
  |
  v
Login Page
  |
  v
Clerk
  |
  v
Authentication Success
  |
  v
Session / Token
  |
  v
Backend API
  |
  v
Verify Identity
  |
  v
Find / Create Internal User
  |
  v
Load Workspace
  |
  v
Load Role / Permission
  |
  v
Application
```

Routes baseline:

```text
/login
/sign-up
/forgot-password
/reset-password
```

---

## 5. Login Flow — Super Admin

```text
/admin/login
   |
   v
Clerk Authentication
   |
   v
Backend API
   |
   v
Check Platform Role
   |
   +-- super_admin -> allow
   |
   +-- otherwise -> 403
```

Frontend chỉ điều khiển UX.

Backend là authorization authority cuối cùng.

---

## 6. Login Flow — Desktop App

Desktop App dùng:

```text
System Browser
+
OAuth Authorization Code Flow
+
PKCE
+
Deep Link
+
One-Time Authorization Code
```

Không login Google trực tiếp trong:

```text
Electron WebView
iframe
embedded browser
renderer-owned OAuth flow
```

Flow chính thức:

```text
Desktop App
   |
   v
Generate PKCE verifier
   |
   v
Generate PKCE challenge
   |
   v
Open System Browser
   |
   v
Clerk Authentication
   |
   v
Google Login
   |
   v
Backend Auth Callback
   |
   v
Generate One-Time Authorization Code
   |
   v
Redirect
mychatbot://auth/callback?code=xxxxx
   |
   v
Electron Main Process receives Deep Link
   |
   v
POST /api/auth/desktop/exchange
   |
   v
Backend validates:
- authorization code
- PKCE verifier
- expiration
- one-time usage
   |
   v
Desktop Session Created
   |
   v
Secure Session Storage
```

---

## 7. Desktop Login Security Rules

Không truyền access token trực tiếp qua deep link.

Sai:

```text
mychatbot://auth/callback?token=ACCESS_TOKEN
```

Đúng:

```text
mychatbot://auth/callback?code=ONE_TIME_CODE
```

One-time code phải:

```text
short-lived
single-use
bound to PKCE
invalid after exchange
invalid after expiration
```

Không lưu long-lived token trong:

```text
localStorage
renderer state
plain text file
```

Session nhạy cảm phải đi qua secure storage phù hợp với Desktop App.

---

## 8. Desktop Deep Link

Baseline custom scheme:

```text
mychatbot://
```

Callback:

```text
mychatbot://auth/callback
```

Electron Main Process chịu trách nhiệm:

```text
protocol registration
deep link parsing
auth callback handling
session handoff
```

Cấu trúc:

```text
apps/desktop/
|
+-- electron/
|   +-- main/
|   |   +-- auth/
|   |       +-- protocol.ts
|   |       +-- auth-handler.ts
|   |
|   +-- preload/
|
+-- renderer/
    +-- features/
        +-- auth/
```

---

## 9. Desktop PKCE

Mỗi login attempt phải tạo:

```text
code_verifier
code_challenge
```

Không hard-code verifier.

Authorization flow chỉ hoàn tất khi backend xác minh verifier hợp lệ.

---

## 10. Desktop Backend Endpoints

Baseline:

```text
GET  /api/auth/desktop/start
GET  /api/auth/desktop/callback
POST /api/auth/desktop/exchange
POST /api/auth/logout
```

`/desktop/start`:

```text
create auth attempt
bind PKCE challenge
create state
build Clerk authorization URL
```

`/desktop/callback`:

```text
validate provider callback
resolve Clerk identity
create one-time authorization code
redirect to custom deep link
```

`/desktop/exchange`:

```text
validate one-time code
validate PKCE verifier
check expiration
check one-time usage
create desktop session
invalidate authorization code
```

---

## 11. Login Flow — Mobile

```text
Mobile App
   |
   v
Login Screen
   |
   v
Clerk Authentication
   |
   v
Secure Session
   |
   v
Backend API
   |
   v
Workspace
   |
   v
Application
```

Biometric unlock có thể bổ sung sau nhưng chỉ là local unlock layer, không thay thế identity provider.

---

## 12. Shared Auth Package

```text
packages/auth/
|
+-- core/
|   +-- session.ts
|   +-- identity.ts
|   +-- auth.types.ts
|
+-- login/
|   +-- login.schema.ts
|   +-- login.types.ts
|   +-- login.service.ts
|
+-- permissions/
|
+-- adapters/
    +-- web/
    +-- electron/
    |   +-- pkce.ts
    |   +-- deep-link.ts
    |   +-- session.ts
    |   +-- desktop-auth.ts
    |
    +-- native/
```

Shared auth package không phụ thuộc trực tiếp vào UI.

---

## 13. Backend Auth Module

```text
apps/api/src/modules/auth/
|
+-- auth.controller.ts
+-- auth.service.ts
+-- auth.middleware.ts
+-- auth.guard.ts
+-- auth.types.ts
|
+-- desktop-auth.controller.ts
+-- desktop-auth.service.ts
+-- desktop-auth.types.ts
```

---

## 14. Internal User

Conceptual model:

```ts
User {
  id
  clerkUserId
  email
  name
  platformRole
  createdAt
  updatedAt
}
```

Không dùng Clerk user object làm toàn bộ domain user model.

---

## 15. Platform Role

```text
super_admin
user
```

```text
Workspace Admin
!=
Platform Super Admin
```

---

## 16. Workspace Membership

```ts
WorkspaceMembership {
  workspaceId
  userId
  role
}
```

User có thể:

```text
Workspace 1 -> owner
Workspace 2 -> admin
Workspace 3 -> member
```

Không dùng một global `user.role = "admin"` cho mọi workspace.

---

## 17. Workspace Roles

Baseline:

```text
owner
admin
member
viewer
```

---

## 18. Clerk Organization Mapping

Có thể map:

```text
Clerk Organization
=
Workspace Identity / Membership Layer
```

Nhưng authorization nghiệp vụ sâu vẫn nằm trong database của hệ thống.

```text
Clerk
|
+-- Identity
+-- Authentication
+-- Session
+-- Organization Membership
|
v
Our Database
|
+-- Workspace Domain Data
+-- Platform Role
+-- Agent Permissions
+-- MCP Permissions
+-- Tool Permissions
+-- Resource Permissions
```

---

## 19. API Authentication

```text
Receive Request
   |
   v
Verify Clerk Session / JWT
   |
   v
Resolve Internal User
   |
   v
Resolve Workspace
   |
   v
Resolve Membership
   |
   v
Check Permission
   |
   v
Execute Request
```

Không tin role hoặc permission do frontend tự gửi nếu chưa verify phía server.

---

## 20. Authorization Layers

```text
Authentication
   |
   v
Platform Permission
   |
   v
Workspace Membership
   |
   v
Workspace Role
   |
   v
Resource Permission
   |
   v
Agent / Tool / MCP Policy
```

---

## 21. Agent / MCP Permission Boundary

Clerk không quản lý trực tiếp toàn bộ Agent/MCP permission.

Database nội bộ quản lý:

```text
AgentPermission
ToolPermission
MCPPermission
WorkspacePolicy
```

---

## 22. Session Management

Session policy phải hỗ trợ:

```text
session creation
session restore
session refresh
session expiration
logout
revocation
multi-device session
```

Platform-specific storage:

```text
Web
-> browser/session mechanism phù hợp với Clerk

Desktop
-> secure desktop storage

Mobile
-> secure native storage
```

---

## 23. Logout

Logout phải:

```text
invalidate local session
clear local sensitive state
notify auth provider when required
clear workspace-specific cached auth data
```

---

## 24. Session Expiration

```text
API returns auth error
   |
   v
Auth Adapter
   |
   +-- refresh if allowed
   |
   +-- otherwise logout
   |
   v
Login Screen
```

Không retry vô hạn.

---

## 25. Auth UI Sharing

```text
Web
Admin
Desktop Renderer
-> @repo/ui-web

Mobile
-> @repo/ui-native
```

Dùng chung:

```text
design-tokens
theme
icons
validation contract
auth types
```

---

## 26. Security Rules

1. Không hard-code Clerk secret.
2. Không đưa Google client secret vào frontend.
3. Không đưa service secret vào Electron Renderer.
4. Desktop OAuth mở system browser.
5. Desktop OAuth dùng PKCE.
6. Deep link chỉ truyền one-time code.
7. Không truyền access token trong URL.
8. Backend phải verify authorization code.
9. One-time code phải có expiration.
10. One-time code chỉ được exchange một lần.
11. Backend là authorization authority.
12. `super_admin` phải verify server-side.
13. Workspace membership phải verify server-side.
14. Agent / MCP / Tool permission phải verify trong trusted runtime.
15. Session nhạy cảm phải dùng secure storage phù hợp platform.
16. Auth errors không leak secrets.
17. OAuth flow phải dùng state/anti-CSRF mechanism phù hợp.

---

## 27. Folder Ownership

```text
packages/auth
= shared auth contracts + adapters

apps/api/src/modules/auth
= backend authentication

apps/api/src/modules/workspaces
= workspace membership

apps/web/src/features/auth
= Web Auth UI

apps/admin/src/features/auth
= Admin Auth UI

apps/desktop/renderer/features/auth
= Desktop Auth UI

apps/desktop/electron/main/auth
= Desktop privileged auth bridge

apps/mobile/src/features/auth
= Mobile Auth UI
```

---

## 28. Agent Documentation Routing

Login UI:

```text
docs/AUTH_RBAC.md
docs/FRONTEND.md
```

Login API:

```text
docs/AUTH_RBAC.md
docs/BACKEND.md
```

Desktop Login:

```text
docs/AUTH_RBAC.md
docs/FRONTEND.md
docs/BACKEND.md
```

Agent/MCP permission:

```text
docs/AUTH_RBAC.md
docs/AGENT.md
docs/MCP.md
```

---

## 29. Baseline đã chốt

```text
Auth Provider
= Clerk

Web
= Clerk React

Admin
= Clerk React

Mobile
= Clerk Expo

Desktop
= System Browser OAuth
+ PKCE
+ Deep Link
+ One-Time Code Exchange
```

Authorization:

```text
Platform
-> super_admin

Workspace
-> owner
-> admin
-> member
-> viewer
```

Clerk quản lý:

```text
Identity
Authentication
Session
Basic Organization Membership
```

Database của hệ thống quản lý:

```text
Platform Authorization
Workspace Domain Authorization
Agent Permission
MCP Permission
Tool Permission
Resource Permission
```

## Related Workspace & Data Docs

Workspace ownership, membership và tenant isolation:

```text
docs/WORKSPACE.md
```

Entity/schema liên quan:

```text
docs/DATA_MODEL.md
```
