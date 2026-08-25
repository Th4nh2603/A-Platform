# MCP Servers

Tài liệu này quy định cách khai báo, tổ chức, phân quyền và sử dụng MCP Server trong AI Platform.

---

## 1. Mục tiêu

MCP Server là integration boundary giữa Agent Runtime và hệ thống bên ngoài.

Ví dụ:

```text
GitHub
Filesystem
PostgreSQL
Figma
Internal API
Search Provider
Document Service
```

Agent không kết nối trực tiếp tới các service này.

Luồng chuẩn:

```text
Agent
  |
  v
Tool Router
  |
  v
MCP Gateway
  |
  v
MCP Client
  |
  v
MCP Server
  |
  v
External Service
```

---

## 2. Nguyên tắc chung

1. Mỗi MCP Server phải có ownership rõ ràng.
2. MCP Server chỉ expose capability cần thiết.
3. Tool discovery không đồng nghĩa với permission.
4. Permission phải được filter theo Agent.
5. Tool có risk cao phải yêu cầu approval.
6. Credential chỉ tồn tại trong trusted runtime.
7. Không để frontend giữ MCP credential.
8. Không để frontend gọi MCP Server trực tiếp.
9. Mọi MCP call phải có timeout và error handling.
10. Mọi action quan trọng phải có audit log.

---

## 3. MCP Server Registry

Mỗi server nên có metadata tối thiểu:

```ts
type MCPServerDefinition = {
  id: string
  name: string
  description?: string

  transport: "stdio" | "http"

  enabled: boolean

  capabilities?: {
    tools?: boolean
    resources?: boolean
    prompts?: boolean
  }

  riskLevel?: "low" | "medium" | "high"

  tags?: string[]
}
```

Registry chịu trách nhiệm lưu:

```text
server metadata
connection status
capabilities
tool inventory
resource inventory
assigned agents
permission policy
health status
```

---

## 4. Cấu trúc thư mục đề xuất

```text
packages/mcp-core/
|
+-- manager/
|   +-- mcp-manager.ts
|
+-- registry/
|   +-- mcp-registry.ts
|   +-- server-definition.ts
|
+-- client/
|   +-- mcp-client.ts
|   +-- transports/
|       +-- stdio.ts
|       +-- http.ts
|
+-- gateway/
|   +-- mcp-gateway.ts
|
+-- permissions/
|   +-- permission-engine.ts
|   +-- policies.ts
|
+-- discovery/
|   +-- tool-discovery.ts
|   +-- resource-discovery.ts
|
+-- validation/
|   +-- input-validator.ts
|   +-- output-validator.ts
|
+-- audit/
|   +-- audit-log.ts
|
+-- connections/
    +-- connection-manager.ts
```

---

## 5. Config MCP

Khuyến nghị lưu cấu hình logic theo dạng chuẩn nội bộ.

Ví dụ:

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "enabled": true,
      "url": "env:MCP_GITHUB_URL"
    },
    "filesystem": {
      "transport": "stdio",
      "enabled": true,
      "command": "node",
      "args": ["./servers/filesystem.js"]
    }
  }
}
```

Không commit secret trực tiếp vào config.

Sai:

```json
{
  "token": "ghp_xxxxxxxxx"
}
```

Đúng:

```json
{
  "token": "env:GITHUB_TOKEN"
}
```

---

## 6. GitHub MCP

Mục đích:

```text
repository
issues
pull requests
branches
commits
code search
reviews
```

Tool ví dụ:

```text
github.get_repository
github.search_code
github.get_issue
github.list_issues
github.get_pull_request
github.get_diff
github.create_issue
github.create_branch
github.create_pull_request
github.create_review
```

Permission gợi ý:

### Research Agent

```text
github.get_repository
github.search_code
github.get_issue
github.list_issues
github.get_pull_request
```

### Review Agent

```text
github.get_repository
github.search_code
github.get_pull_request
github.get_diff
```

### Coding Agent

```text
github.get_repository
github.search_code
github.get_issue
github.get_pull_request
github.get_diff
github.create_branch
github.create_pull_request
```

Các action ghi dữ liệu nên có policy riêng.

Ví dụ:

```text
github.create_pull_request
risk = medium
approval = optional/configurable

github.merge_pull_request
risk = high
approval = required
```

---

## 7. Filesystem MCP

Mục đích:

```text
read file
write file
list directory
search files
create file
delete file
move file
```

Tool ví dụ:

```text
filesystem.read_file
filesystem.write_file
filesystem.list_directory
filesystem.search
filesystem.create_directory
filesystem.move
filesystem.delete
```

Permission gợi ý:

### Research Agent

```text
filesystem.read_file
filesystem.list_directory
filesystem.search
```

### Review Agent

```text
filesystem.read_file
filesystem.list_directory
filesystem.search
```

### Coding Agent

```text
filesystem.read_file
filesystem.write_file
filesystem.list_directory
filesystem.search
filesystem.create_directory
filesystem.move
```

Delete:

```text
filesystem.delete
risk = high
approval = required
```

Nên hỗ trợ workspace sandbox.

Ví dụ:

```text
allowedRoot:
  /workspace/current-project
```

Agent không được truy cập ngoài allowed root nếu chưa được cấp quyền.

---

## 8. PostgreSQL MCP

Mục đích:

```text
schema inspection
query
read analytics
controlled mutation
```

Tool ví dụ:

```text
postgres.describe_schema
postgres.list_tables
postgres.select
postgres.explain
postgres.execute
```

Permission mặc định nên là read-only.

Ví dụ:

```text
Research Agent
-> describe_schema
-> list_tables
-> select
```

Mutation:

```text
INSERT
UPDATE
DELETE
DDL
```

phải được phân quyền riêng.

Khuyến nghị:

```text
postgres.execute
risk = high
approval = required
```

Production database nên dùng policy chặt hơn development database.

---

## 9. Figma MCP

Mục đích:

```text
read design
inspect components
read tokens
read frames
read styles
export assets
```

Tool ví dụ:

```text
figma.get_file
figma.get_node
figma.list_components
figma.get_styles
figma.export_asset
```

Mặc định nên read-only.

Nếu sau này hỗ trợ edit Figma:

```text
figma.update_node
figma.create_component
```

thì phải thêm permission và approval riêng.

---

## 10. Internal API MCP

Dùng để kết nối Agent tới service nội bộ.

Ví dụ:

```text
CRM
ERP
CMS
Marketing API
Document API
Analytics API
```

Không expose toàn bộ REST API trực tiếp.

Nên wrap thành semantic tools.

Không nên:

```text
internal.request(method, url, body)
```

Nên:

```text
crm.get_customer
crm.search_customer
crm.create_note
analytics.get_campaign_report
```

Lý do:

- dễ permission
- dễ audit
- dễ validate
- giảm tool misuse
- schema rõ ràng hơn cho Agent

---

## 11. Tool Naming Convention

Dùng format:

```text
namespace.action
```

Ví dụ:

```text
github.get_issue
github.create_pull_request
filesystem.read_file
postgres.describe_schema
figma.get_node
```

Không dùng tên quá chung:

```text
read
get
run
execute
```

Tool name phải cho biết domain.

---

## 12. Tool Metadata

Mỗi tool nên có metadata:

```ts
type ToolMetadata = {
  name: string
  description: string

  riskLevel: "low" | "medium" | "high"

  readOnly: boolean
  destructive: boolean

  requiresApproval: boolean

  allowedAgents?: string[]
}
```

Ví dụ:

```json
{
  "name": "filesystem.delete",
  "riskLevel": "high",
  "readOnly": false,
  "destructive": true,
  "requiresApproval": true
}
```

---

## 13. Permission Matrix

Ví dụ baseline:

| Tool Group | Main Agent | Coding | Research | Review |
|---|---|---|---|---|
| GitHub Read | Yes | Yes | Yes | Yes |
| GitHub Write | Conditional | Yes | No | No |
| Files Read | Yes | Yes | Yes | Yes |
| Files Write | Conditional | Yes | No | No |
| Files Delete | Approval | Approval | No | No |
| Web Search | Yes | Yes | Yes | Yes |
| Database Read | Conditional | Conditional | Yes | Yes |
| Database Write | Approval | Approval | No | No |

Permission thực tế phải cấu hình theo workspace và environment.

---

## 14. Risk Levels

### Low

Ví dụ:

```text
read file
list directory
search code
read issue
read schema
```

Có thể execute tự động nếu Agent có permission.

### Medium

Ví dụ:

```text
write file
create branch
create issue
create pull request
```

Có thể yêu cầu approval tùy workspace policy.

### High

Ví dụ:

```text
delete file
merge pull request
database mutation
production deployment
credential change
```

Mặc định phải approval.

---

## 15. Approval Flow

```text
Agent
  |
  v
Tool Request
  |
  v
MCP Gateway
  |
  v
Risk Evaluation
  |
  +-- Low
  |    |
  |    v
  |  Execute
  |
  +-- Medium
  |    |
  |    v
  |  Policy Check
  |
  +-- High
       |
       v
   User Approval
       |
       v
    Execute
```

Approval UI nên hiển thị:

```text
Agent
Tool
Target
Parameters
Risk
Reason
```

Ví dụ:

```text
Coding Agent wants to delete:

/workspace/app/database.sqlite

Risk:
HIGH

[Cancel] [Approve]
```

---

## 16. MCP Server Health

Mỗi MCP Server nên có trạng thái:

```text
connected
disconnected
connecting
error
disabled
```

Health metadata:

```text
lastConnectedAt
lastError
latency
toolCount
resourceCount
```

Dashboard MCP nên hiển thị các thông tin này.

---

## 17. Logging và Audit

Audit log tối thiểu:

```text
timestamp
workspaceId
userId
agentId
serverId
toolName
inputSummary
resultStatus
riskLevel
approvalStatus
duration
requestId
```

Không log secret hoặc raw credential.

---

## 18. Error Handling

MCP Gateway chuẩn hóa error.

Ví dụ:

```ts
type MCPError = {
  code: string
  message: string
  serverId?: string
  toolName?: string
  retryable: boolean
  requestId: string
}
```

Các nhóm error:

```text
CONNECTION_ERROR
AUTH_ERROR
PERMISSION_DENIED
APPROVAL_REQUIRED
TOOL_NOT_FOUND
INVALID_INPUT
TIMEOUT
REMOTE_ERROR
RATE_LIMITED
```

---

## 19. MCP trong UI

Frontend chỉ gọi backend API.

Không:

```text
React
  -> MCP Server
```

Đúng:

```text
React
  -> Backend API
      -> Agent Runtime
          -> MCP Gateway
              -> MCP Server
```

Dashboard MCP có thể gồm:

```text
MCP Servers
├── Overview
├── Tools
├── Resources
├── Permissions
├── Agents
├── Health
└── Logs
```

---

## 20. Agent Assignment

Mỗi server có thể assign cho một hoặc nhiều Agent.

Ví dụ:

```text
GitHub MCP
├── Coding Agent
├── Research Agent
└── Review Agent

Filesystem MCP
├── Coding Agent
└── Review Agent

PostgreSQL MCP
└── Research Agent
```

Nhưng server assignment chưa đủ.

Tool-level permission vẫn phải được kiểm tra.

---

## 21. Environment Policy

Phân biệt:

```text
development
staging
production
```

Ví dụ:

### Development

```text
filesystem.write
database.write
```

có thể dễ hơn.

### Production

```text
database.write
filesystem.delete
deployment
```

phải policy chặt và approval bắt buộc.

---

## 22. Rule cho Codex / AI Agent

Khi thêm MCP Server mới:

1. Xác định purpose.
2. Xác định tool list.
3. Xác định read/write boundary.
4. Đặt tool naming rõ ràng.
5. Khai báo risk level.
6. Khai báo permission.
7. Khai báo approval requirement.
8. Không hard-code credential.
9. Thêm timeout.
10. Thêm error mapping.
11. Thêm audit.
12. Không expose generic arbitrary-execution tool nếu không thật sự cần.
13. Không cấp tool cho mọi Agent theo mặc định.
14. Cập nhật tài liệu nếu capability mới thay đổi architecture.

---

## 23. Baseline MCP Servers

Baseline đề xuất cho giai đoạn đầu:

```text
1. Filesystem MCP
2. GitHub MCP
3. Web/Search MCP
```

Giai đoạn tiếp theo:

```text
4. PostgreSQL MCP
5. Figma MCP
6. Internal API MCP
```

Không cần tích hợp quá nhiều MCP ngay từ đầu.

Ưu tiên các MCP Server phục vụ trực tiếp workflow chính của sản phẩm.
