# Data Model

Tài liệu này là source of truth cho domain model chính của AI Platform.

Mục tiêu:

```text
User
Workspace
Conversation
Message
Agent
Skill
MCP Server
Tool Permission
Agent Execution
Memory
File
Knowledge
Usage
```

Mọi model phải có ownership và relationship rõ ràng.

---

## 1. Nguyên tắc chung

1. Mọi resource nghiệp vụ chính phải gắn với `workspaceId`.
2. Không dùng `userId` làm tenant boundary.
3. Internal ID phải tách khỏi external provider ID.
4. Soft delete được ưu tiên cho resource quan trọng.
5. Audit field phải thống nhất.
6. Relation phải rõ ownership.
7. Permission không được suy ra chỉ từ frontend state.
8. Execution data phải hỗ trợ trace và resume.
9. File metadata tách khỏi binary/object storage.
10. Knowledge document tách khỏi chunk/vector representation.

---

## 2. Common Fields

Baseline:

```ts
type BaseEntity = {
  id: string

  createdAt: Date
  updatedAt: Date

  deletedAt?: Date | null
}
```

Workspace-owned resource:

```ts
type WorkspaceEntity = BaseEntity & {
  workspaceId: string
}
```

---

## 3. User

```ts
User {
  id
  clerkUserId

  email
  name
  avatarUrl

  platformRole

  createdAt
  updatedAt
  deletedAt
}
```

`clerkUserId` dùng để map Clerk identity sang internal user.

Platform roles baseline:

```text
super_admin
user
```

Không dùng Workspace role làm global user role.

---

## 4. Workspace

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

Status baseline:

```text
active
suspended
deleted
```

Workspace là tenant boundary chính.

---

## 5. Workspace Membership

```ts
WorkspaceMember {
  id

  workspaceId
  userId

  role
  status

  joinedAt

  createdAt
  updatedAt
}
```

Role baseline:

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

Unique constraint:

```text
workspaceId + userId
```

---

## 6. Workspace Invitation

```ts
WorkspaceInvitation {
  id

  workspaceId

  email
  role

  tokenHash

  invitedByUserId

  status
  expiresAt
  acceptedAt

  createdAt
  updatedAt
}
```

Status:

```text
pending
accepted
expired
revoked
```

Không lưu raw invitation token nếu có thể lưu hash.

---

## 7. Conversation

```ts
Conversation {
  id
  workspaceId

  createdByUserId

  title
  status

  agentId?

  createdAt
  updatedAt
  deletedAt
}
```

Status:

```text
active
archived
deleted
```

Conversation luôn thuộc một Workspace.

---

## 8. Message

```ts
Message {
  id

  workspaceId
  conversationId

  senderType
  senderId?

  role

  content
  contentType

  parentMessageId?

  createdAt
  updatedAt
}
```

Sender type:

```text
user
agent
system
tool
```

Role có thể gồm:

```text
user
assistant
system
tool
```

Không dùng Message làm storage cho toàn bộ trace execution.

Execution trace phải có model riêng.

---

## 9. Agent

```ts
Agent {
  id
  workspaceId

  name
  description

  type

  instruction

  modelProvider
  modelName

  status

  createdByUserId

  createdAt
  updatedAt
  deletedAt
}
```

Type:

```text
main
subagent
```

Status:

```text
active
disabled
archived
```

Sub-agent vẫn là Agent.

---

## 10. Agent Relationship

Nếu cần khai báo agent hierarchy:

```ts
AgentRelation {
  id

  workspaceId

  parentAgentId
  childAgentId

  relationType

  createdAt
}
```

Relation type:

```text
delegate
review
fallback
```

Không hard-code sub-agent tree trực tiếp trong source code nếu cần config động.

---

## 11. Skill

```ts
Skill {
  id
  workspaceId

  name
  slug
  description

  sourceType
  sourcePath?

  status

  createdByUserId

  createdAt
  updatedAt
  deletedAt
}
```

Source type:

```text
repository
database
builtin
```

Skill content có thể nằm trong:

```text
skills/<skill-name>/SKILL.md
```

hoặc storage/database nếu hỗ trợ dynamic skills.

---

## 12. Agent Skill Assignment

```ts
AgentSkill {
  id

  workspaceId

  agentId
  skillId

  enabled

  createdAt
}
```

Unique:

```text
agentId + skillId
```

---

## 13. MCP Server

```ts
MCPServer {
  id
  workspaceId

  name
  slug

  transport

  status
  enabled

  configReference

  createdByUserId

  createdAt
  updatedAt
  deletedAt
}
```

Transport:

```text
stdio
http
```

Không lưu raw secret trực tiếp trong `configReference`.

Secret phải nằm trong secure secret storage.

---

## 14. MCP Tool

```ts
MCPTool {
  id

  workspaceId
  mcpServerId

  name
  description

  riskLevel

  readOnly
  destructive

  schema

  enabled

  discoveredAt
  updatedAt
}
```

Risk:

```text
low
medium
high
```

---

## 15. Tool Permission

```ts
ToolPermission {
  id

  workspaceId

  subjectType
  subjectId

  toolId

  effect

  requiresApproval

  createdAt
  updatedAt
}
```

Subject type:

```text
user
role
agent
```

Effect:

```text
allow
deny
```

Không assume server assignment đồng nghĩa tool permission.

---

## 16. Agent Execution

```ts
AgentExecution {
  id

  workspaceId
  conversationId?

  agentId
  userId

  parentExecutionId?

  status
  currentStep?

  startedAt
  updatedAt
  completedAt?

  inputSummary?
  outputSummary?

  errorCode?

  createdAt
}
```

Status:

```text
created
loading
running
waiting_for_tool
waiting_for_subagent
waiting_for_approval
completed
failed
cancelled
timed_out
```

Execution phải persist để hỗ trợ:

```text
trace
resume
audit
usage
debug
```

---

## 17. Execution Step

```ts
AgentExecutionStep {
  id

  workspaceId
  executionId

  stepIndex
  stepType

  status

  startedAt
  completedAt?

  inputSummary?
  outputSummary?

  metadata

  createdAt
}
```

Step type:

```text
context_build
llm_call
tool_call
subagent
approval
memory
result
```

Không lưu private chain-of-thought.

Chỉ lưu operational trace cần thiết.

---

## 18. Approval Request

```ts
ApprovalRequest {
  id

  workspaceId
  executionId

  agentId
  userId

  toolName
  target
  parametersSummary

  riskLevel
  reason

  status

  requestedAt
  resolvedAt?
  resolvedByUserId?
}
```

Status:

```text
pending
approved
rejected
expired
cancelled
```

---

## 19. Memory

```ts
Memory {
  id

  workspaceId

  scopeType
  scopeId?

  memoryType

  content
  metadata

  createdAt
  updatedAt
  expiresAt?
  deletedAt?
}
```

Scope type:

```text
conversation
workspace
user
agent
```

Memory type:

```text
summary
preference
fact
working
retrieval
```

Không trộn mọi memory vào một global namespace.

---

## 20. File

```ts
File {
  id

  workspaceId

  uploadedByUserId

  name
  mimeType
  size

  storageProvider
  storageKey

  checksum

  status

  createdAt
  updatedAt
  deletedAt
}
```

Status:

```text
uploading
ready
processing
failed
deleted
```

Binary/object content nằm ở object storage.

Database chỉ lưu metadata/reference.

---

## 21. Knowledge Document

```ts
KnowledgeDocument {
  id

  workspaceId
  fileId?

  title
  sourceType
  sourceReference?

  status

  createdByUserId

  createdAt
  updatedAt
  deletedAt
}
```

Source type:

```text
file
url
manual
integration
```

Status:

```text
pending
processing
ready
failed
archived
```

---

## 22. Knowledge Chunk

```ts
KnowledgeChunk {
  id

  workspaceId
  knowledgeDocumentId

  chunkIndex

  content
  tokenCount

  embeddingReference?

  metadata

  createdAt
}
```

Vector store ID có thể nằm trong `embeddingReference`.

Không nhất thiết lưu raw vector trực tiếp trong primary database.

---

## 23. Usage Record

```ts
UsageRecord {
  id

  workspaceId
  userId?
  agentId?
  executionId?

  usageType

  provider?
  model?

  inputTokens?
  outputTokens?
  totalTokens?

  quantity?
  costAmount?
  currency?

  occurredAt

  createdAt
}
```

Usage type:

```text
llm
embedding
tool
storage
execution
```

Usage phải hỗ trợ aggregation theo:

```text
workspace
user
agent
model
date
```

---

## 24. Workspace Settings

```ts
WorkspaceSettings {
  id
  workspaceId

  defaultModel
  defaultAgentId?

  retentionPolicy
  approvalPolicy

  createdAt
  updatedAt
}
```

---

## 25. Relationships Overview

```text
User
  |
  +-- WorkspaceMember
          |
          v
      Workspace
          |
          +-- Conversations
          |     +-- Messages
          |
          +-- Agents
          |     +-- AgentSkills
          |
          +-- Skills
          |
          +-- MCPServers
          |     +-- MCPTools
          |           +-- ToolPermissions
          |
          +-- AgentExecutions
          |     +-- ExecutionSteps
          |     +-- ApprovalRequests
          |
          +-- Memories
          |
          +-- Files
          |
          +-- KnowledgeDocuments
          |     +-- KnowledgeChunks
          |
          +-- UsageRecords
```

---

## 26. Tenant Isolation Rule

Mọi query cho workspace-owned resource phải scope theo:

```text
workspaceId
```

Sai:

```text
SELECT * FROM conversations WHERE id = ?
```

Đúng conceptual rule:

```text
SELECT *
FROM conversations
WHERE id = ?
AND workspace_id = ?
```

Authorization phải verify membership trước khi access.

---

## 27. Soft Delete

Khuyến nghị soft delete cho:

```text
Workspace
Conversation
Agent
Skill
MCPServer
File
KnowledgeDocument
```

Hard delete chỉ dùng khi retention policy cho phép.

---

## 28. Indexing Baseline

Nên có index cho:

```text
workspaceId
userId
conversationId
agentId
executionId
createdAt
status
```

Composite index quan trọng:

```text
workspaceId + createdAt
workspaceId + status
conversationId + createdAt
executionId + stepIndex
workspaceId + userId
workspaceId + agentId
```

---

## 29. Data Model Routing

Task liên quan:

```text
schema
database model
entity
relation
migration
foreign key
index
tenant field
```

Agent phải đọc:

```text
docs/DATA_MODEL.md
```

Nếu liên quan Workspace:

```text
docs/WORKSPACE.md
docs/AUTH_RBAC.md
```

Nếu liên quan Agent Execution:

```text
docs/AGENT_RUNTIME.md
```

Nếu liên quan MCP permission:

```text
docs/MCP.md
docs/MCP_SERVERS.md
```

---

## 30. Baseline đã chốt

Tenant boundary:

```text
Workspace
```

Identity:

```text
Clerk User
-> Internal User
```

Workspace-owned resources:

```text
Conversation
Agent
Skill
MCP Server
Execution
Memory
File
Knowledge
Usage
```

Execution persistence:

```text
AgentExecution
+
AgentExecutionStep
```

Knowledge:

```text
File
-> KnowledgeDocument
-> KnowledgeChunk
```
