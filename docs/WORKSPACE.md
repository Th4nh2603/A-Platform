# Workspace

Tài liệu này mô tả multi-workspace architecture, ownership, membership, invitation và tenant isolation của AI Platform.

---

## 1. Workspace là Tenant Boundary

Workspace là boundary chính cho dữ liệu nghiệp vụ.

```text
User
  |
  v
Workspace
  |
  +-- Conversations
  +-- Agents
  +-- Skills
  +-- MCP Servers
  +-- Files
  +-- Knowledge
  +-- Executions
  +-- Usage
```

Không thiết kế các resource này chỉ gắn trực tiếp với `userId`.

---

## 2. Multi-Workspace

Một user có thể thuộc nhiều Workspace.

Ví dụ:

```text
User A
|
+-- Workspace Alpha
|     role = owner
|
+-- Workspace Beta
|     role = admin
|
+-- Workspace Gamma
      role = member
```

Mỗi Workspace có:

```text
members
roles
resources
settings
integrations
usage
```

---

## 3. Workspace Model

```ts
Workspace {
  id
  name
  slug

  ownerUserId

  status

  createdAt
  updatedAt
  deletedAt
}
```

Status:

```text
active
suspended
deleted
```

---

## 4. Ownership

Mỗi Workspace phải có một owner hiện tại.

Owner có quyền baseline:

```text
manage workspace
manage members
manage integrations
manage Agents
manage MCP
manage billing/usage policy
transfer ownership
delete workspace
```

Nếu hỗ trợ ownership transfer:

```text
Current Owner
  |
  v
Select Member
  |
  v
Confirm Transfer
  |
  v
New Owner
```

Không cho Workspace rơi vào trạng thái không có owner.

---

## 5. Workspace Members

```ts
WorkspaceMember {
  id

  workspaceId
  userId

  role
  status

  joinedAt
}
```

Roles:

```text
owner
admin
member
viewer
```

Status:

```text
active
suspended
removed
```

---

## 6. Role Baseline

### Owner

```text
full workspace management
member management
workspace settings
integration management
Agent/MCP policy management
ownership transfer
workspace deletion
```

### Admin

```text
member management
resource management
Agent management
Skill management
integration management based on policy
```

### Member

```text
use workspace
create conversations
use allowed Agents
use allowed tools
upload allowed files
```

### Viewer

```text
read-only access
```

Detailed permission vẫn có thể mở rộng ngoài role.

---

## 7. Invitation Flow

```text
Admin / Owner
    |
    v
Invite Email
    |
    v
Create WorkspaceInvitation
    |
    v
Send Invitation
    |
    v
User Opens Link
    |
    v
Authenticate
    |
    v
Validate Invitation
    |
    v
Create WorkspaceMember
    |
    v
Invitation Accepted
```

Invitation phải có:

```text
workspaceId
email
role
token
expiration
invitedBy
status
```

Token nên lưu hash nếu phù hợp.

---

## 8. Invitation States

```text
pending
accepted
expired
revoked
```

Không accept invitation nếu:

```text
expired
revoked
email mismatch
workspace suspended
```

Policy email matching có thể cấu hình theo auth provider.

---

## 9. Active Workspace

Client có thể giữ khái niệm:

```text
activeWorkspaceId
```

Nhưng đây chỉ là UI/session context.

Backend vẫn phải verify:

```text
user is member of workspace?
role valid?
workspace active?
```

Không tin `activeWorkspaceId` do frontend gửi mà không verify.

---

## 10. Workspace Switching

Flow:

```text
User
  |
  v
Workspace Switcher
  |
  v
Select Workspace
  |
  v
Verify Membership
  |
  v
Load Workspace Context
  |
  v
Reload:
- permissions
- Agents
- Skills
- MCP Servers
- Conversations
- Files
```

Không reuse stale permission từ Workspace cũ.

---

## 11. Resource Ownership

Resource baseline phải có:

```text
workspaceId
```

Ví dụ:

```text
Conversation.workspaceId
Agent.workspaceId
Skill.workspaceId
MCPServer.workspaceId
File.workspaceId
KnowledgeDocument.workspaceId
AgentExecution.workspaceId
UsageRecord.workspaceId
```

---

## 12. Data Isolation

Query luôn phải scope theo Workspace.

Sai:

```text
getConversation(conversationId)
```

Recommended conceptual API:

```text
getConversation(workspaceId, conversationId)
```

Backend phải verify:

```text
request user
  |
  v
workspace membership
  |
  v
resource workspaceId
  |
  v
permission
```

---

## 13. Cross-Workspace Access

Mặc định:

```text
DENY
```

Không cho:

```text
Workspace A Agent
```

tự đọc:

```text
Workspace B Files
```

nếu không có explicit cross-workspace architecture.

Cross-workspace sharing chưa nằm trong baseline.

---

## 14. Workspace + Clerk Organization

Có thể map:

```text
Clerk Organization
=
Workspace membership identity layer
```

Nhưng Workspace domain vẫn có internal ID riêng.

Ví dụ:

```ts
Workspace {
  id
  clerkOrganizationId?
}
```

Không phụ thuộc business data trực tiếp vào Clerk Organization object.

---

## 15. Workspace Creation

Flow:

```text
Authenticated User
   |
   v
Create Workspace
   |
   v
Create Workspace Row
   |
   v
Create Owner Membership
   |
   v
Create Default Settings
   |
   v
Optional Default Agent
   |
   v
Workspace Ready
```

Creation phải transactional nếu database hỗ trợ.

---

## 16. Default Workspace

Có thể hỗ trợ:

```text
personal workspace
```

khi user đăng ký lần đầu.

Flow:

```text
New User
  |
  v
Create Internal User
  |
  v
Create Personal Workspace
  |
  v
role = owner
```

Có thể thay đổi sau nếu business model yêu cầu onboarding khác.

---

## 17. Workspace Settings

Baseline:

```text
name
slug
default model
default Agent
approval policy
data retention
member policy
integration policy
```

Không đặt platform-wide config vào Workspace Settings.

---

## 18. Workspace MCP

MCP Server mặc định thuộc Workspace.

```text
Workspace
  |
  +-- GitHub MCP
  +-- Filesystem MCP
  +-- PostgreSQL MCP
```

Agent chỉ có thể dùng MCP của Workspace hiện tại nếu permission cho phép.

---

## 19. Workspace Agent

Agent thuộc Workspace.

```text
Workspace
  |
  +-- Main Agent
  +-- Coding Agent
  +-- Research Agent
```

Cross-workspace Agent sharing chưa nằm trong baseline.

---

## 20. Workspace Files & Knowledge

```text
Workspace
  |
  +-- Files
  |
  +-- Knowledge Documents
       |
       +-- Knowledge Chunks
```

Retrieval phải filter theo:

```text
workspaceId
```

để tránh cross-tenant data leak.

---

## 21. Workspace Usage

Usage aggregate theo Workspace.

```text
Workspace
  |
  +-- LLM Tokens
  +-- Embeddings
  +-- Tool Calls
  +-- Storage
  +-- Executions
```

Usage có thể dùng cho:

```text
quota
analytics
billing
cost monitoring
```

---

## 22. Workspace Suspension

Nếu Workspace bị suspended:

```text
login vẫn có thể thành công
```

nhưng access Workspace phải bị chặn theo policy.

Ví dụ:

```text
Workspace status = suspended
  |
  v
API returns WORKSPACE_SUSPENDED
```

---

## 23. Member Removal

Khi member bị remove:

```text
revoke workspace access
invalidate workspace-specific cached permission
prevent new executions
preserve historical audit records
```

Không xóa historical Message/Execution chỉ vì user bị remove.

---

## 24. Workspace Deletion

Recommended flow:

```text
Owner
  |
  v
Delete Request
  |
  v
Confirmation
  |
  v
Soft Delete Workspace
  |
  v
Block New Access
  |
  v
Retention Window
  |
  v
Permanent Cleanup
```

Cleanup có thể bao gồm:

```text
files
knowledge vectors
MCP credentials
cache
queued jobs
```

---

## 25. Isolation Rules

1. Mọi workspace resource có `workspaceId`.
2. Backend verify membership.
3. Backend verify resource belongs to Workspace.
4. Agent context chỉ load dữ liệu Workspace hiện tại.
5. Knowledge retrieval filter theo Workspace.
6. MCP Registry filter theo Workspace.
7. Tool permissions filter theo Workspace.
8. Usage ghi theo Workspace.
9. Logs/audit luôn mang workspace context khi có.
10. Cross-workspace access mặc định deny.

---

## 26. Workspace API Baseline

Conceptual endpoints:

```text
POST   /api/workspaces
GET    /api/workspaces
GET    /api/workspaces/:workspaceId
PATCH  /api/workspaces/:workspaceId
DELETE /api/workspaces/:workspaceId

GET    /api/workspaces/:workspaceId/members
POST   /api/workspaces/:workspaceId/invitations
DELETE /api/workspaces/:workspaceId/members/:userId
```

Endpoint thực tế sẽ được chuẩn hóa thêm trong `docs/API.md` nếu bổ sung sau.

---

## 27. Documentation Routing

Task liên quan:

```text
workspace
tenant
member
owner
invitation
workspace switch
workspace isolation
cross-tenant
```

MUST read:

```text
docs/WORKSPACE.md
```

Nếu liên quan role:

```text
docs/AUTH_RBAC.md
```

Nếu liên quan schema:

```text
docs/DATA_MODEL.md
```

Nếu liên quan Agent/MCP:

```text
docs/AGENT.md
docs/MCP.md
```

---

## 28. Baseline đã chốt

```text
Workspace
= tenant boundary
```

Một user:

```text
can belong to many Workspaces
```

Mọi resource nghiệp vụ chính:

```text
must belong to one Workspace
```

Cross-workspace access:

```text
deny by default
```

Roles:

```text
owner
admin
member
viewer
```
