# Agent Runtime

Tài liệu này mô tả execution engine của Agent trong AI Platform.

---

## 1. Mục tiêu

Agent Runtime chịu trách nhiệm thực thi Agent từ lúc nhận request cho tới khi trả final result.

Runtime không phải UI, không phải MCP Server và không phải Skill.

Luồng tổng quát:

```text
User Request
    |
    v
Conversation Runtime
    |
    v
Agent Runtime
    |
    +-- Load Agent
    +-- Assemble Context
    +-- Load Skills
    +-- Resolve Tools
    +-- Select Model
    +-- Execute
    |
    +-- Tool Call
    +-- Sub-agent Delegation
    +-- Approval Pause
    +-- Retry
    |
    v
Final Result
```

---

## 2. Vị trí trong kiến trúc

```text
Client
  |
  v
API
  |
  v
Conversation Runtime
  |
  v
Agent Runtime
  |
  +-- Skill Engine
  +-- Memory
  +-- LLM Router
  +-- Tool Router
  |
  v
MCP Gateway
```

---

## 3. Cấu trúc thư mục đề xuất

```text
packages/agent-core/
|
+-- runtime/
|   +-- agent-runtime.ts
|   +-- execution-loop.ts
|   +-- execution-context.ts
|
+-- context/
|   +-- context-builder.ts
|   +-- context.types.ts
|
+-- state/
|   +-- agent-state.ts
|   +-- execution-state.ts
|
+-- delegation/
|   +-- delegation-manager.ts
|
+-- orchestration/
|   +-- planner.ts
|   +-- executor.ts
|
+-- memory/
|   +-- memory-manager.ts
|
+-- result/
|   +-- result-builder.ts
|
+-- tracing/
|   +-- trace-manager.ts
|
+-- cancellation/
    +-- cancellation-controller.ts
```

---

## 4. Agent Lifecycle

Một execution nên có lifecycle rõ ràng:

```text
created
  |
  v
loading
  |
  v
running
  |
  +-- waiting_for_tool
  +-- waiting_for_subagent
  +-- waiting_for_approval
  |
  v
completed
```

Các trạng thái lỗi:

```text
failed
cancelled
timed_out
```

---

## 5. Execution Context

Execution Context chứa dữ liệu cần thiết cho một lần chạy Agent.

Ví dụ:

```ts
type AgentExecutionContext = {
  executionId: string
  conversationId: string
  workspaceId: string

  userId: string
  agentId: string

  messages: unknown[]
  memory: unknown[]
  skills: unknown[]
  tools: unknown[]

  metadata?: Record<string, unknown>
}
```

Không dùng global mutable state cho execution.

---

## 6. Context Assembly

Trước khi gọi LLM:

```text
Agent Runtime
   |
   +-- System Instruction
   +-- Agent Instruction
   +-- Workspace Rules
   +-- Conversation History
   +-- Relevant Memory
   +-- Relevant Files / Knowledge
   +-- Skill Instructions
   +-- Available Tools
```

Context Builder chịu trách nhiệm assemble context theo budget.

Không inject toàn bộ dữ liệu nếu không cần thiết.

---

## 7. Skill Loading

Skill được load trước hoặc trong execution tùy workflow.

Luồng:

```text
Agent
  |
  v
Skill Resolver
  |
  v
Skill Engine
  |
  v
Relevant Skill Instructions
  |
  v
Execution Context
```

Skill không tự execute external action.

Skill hướng dẫn Agent cách thực hiện công việc.

---

## 8. Tool Resolution

Runtime không expose toàn bộ tool cho Agent.

Luồng:

```text
Agent
  |
  v
Tool Resolver
  |
  +-- Agent permissions
  +-- Workspace policy
  +-- Environment policy
  +-- MCP availability
  |
  v
Allowed Tools
```

Chỉ allowed tools được gửi tới LLM.

---

## 9. LLM Router

Agent Runtime gọi model thông qua:

```text
LLM Router
```

Ví dụ provider:

```text
OpenAI
Anthropic
Gemini
Local Model
Custom Provider
```

Agent config có thể xác định:

```text
preferred model
fallback model
temperature
max output
reasoning mode
```

---

## 10. Execution Loop

Execution loop baseline:

```text
START
  |
  v
Build Context
  |
  v
Call LLM
  |
  +----------------------+
  |                      |
  v                      v
Final Response        Tool Call
                         |
                         v
                    Tool Router
                         |
                         v
                     Tool Result
                         |
                         +-------> Call LLM again
```

Nếu model yêu cầu Sub-agent:

```text
Main Agent
  |
  v
Delegation Manager
  |
  v
Sub-agent Runtime
  |
  v
Sub-agent Result
  |
  v
Main Agent Context
```

---

## 11. Sub-agent Delegation

Sub-agent vẫn chạy qua cùng Agent Runtime.

Không tạo runtime riêng.

Luồng:

```text
Main Agent Execution
      |
      v
Delegation Request
      |
      v
Create Child Execution
      |
      v
Sub-agent
      |
      v
Child Result
      |
      v
Parent Execution
```

Nên lưu:

```text
parentExecutionId
childExecutionId
delegatedTask
result
status
```

---

## 12. Tool Call Flow

```text
Agent Runtime
   |
   v
Tool Request
   |
   v
Tool Router
   |
   +-- Internal Tool
   |
   +-- MCP Gateway
          |
          v
       MCP Server
```

Agent Runtime không gọi MCP Client trực tiếp.

---

## 13. Approval Pause / Resume

High-risk action có thể pause execution:

```text
running
   |
   v
approval_required
   |
   +-- approved -> resume
   |
   +-- rejected -> return tool rejection
```

Runtime phải giữ execution state để resume an toàn.

Approval context nên lưu:

```text
executionId
agentId
toolName
parameters
riskLevel
reason
requestedAt
```

---

## 14. Retry

Retry phải có policy.

Ví dụ retry được:

```text
temporary network error
rate limit
transient provider error
MCP connection timeout
```

Không retry vô hạn.

Baseline:

```text
max attempts
backoff
retryable error list
```

Không retry destructive tool một cách tự động nếu không đảm bảo idempotency.

---

## 15. Timeout

Nên có timeout riêng cho:

```text
Agent Execution
LLM Request
Tool Call
MCP Call
Sub-agent Execution
```

Timeout phải tạo state rõ ràng:

```text
timed_out
```

---

## 16. Cancellation

User hoặc system có thể cancel execution.

Luồng:

```text
User
  |
  v
Cancel Request
  |
  v
Cancellation Controller
  |
  +-- stop pending LLM request
  +-- stop child executions
  +-- stop cancellable tool calls
  |
  v
cancelled
```

Không giả định mọi external action có thể rollback.

---

## 17. Streaming

Conversation Runtime có thể stream event từ Agent Runtime.

Ví dụ:

```text
agent.started
agent.thinking
agent.tool_requested
agent.tool_completed
agent.delegated
agent.approval_required
agent.message_delta
agent.completed
agent.failed
```

UI không cần biết internal implementation chi tiết.

---

## 18. State Management

Execution State nên lưu:

```text
executionId
agentId
status
currentStep
parentExecutionId
startedAt
updatedAt
completedAt
error
```

Không dùng UI store làm source of truth cho Agent execution.

---

## 19. Result Model

Agent Result baseline:

```ts
type AgentResult = {
  executionId: string
  status: "completed" | "failed" | "cancelled" | "timed_out"

  output?: unknown
  error?: unknown

  usage?: {
    inputTokens?: number
    outputTokens?: number
  }
}
```

---

## 20. Trace / Observability

Mỗi execution nên có trace.

Ví dụ:

```text
Execution
├── Context Build
├── LLM Call #1
├── Tool Call
│   └── github.get_issue
├── Sub-agent
│   └── Research Agent
├── LLM Call #2
└── Final Result
```

Trace dùng cho:

```text
debug
cost analysis
latency analysis
audit
Agent evaluation
```

Không expose private chain-of-thought.

Chỉ lưu operational trace cần thiết.

---

## 21. Error Handling

Error groups:

```text
AGENT_CONFIG_ERROR
CONTEXT_ERROR
MODEL_ERROR
TOOL_ERROR
PERMISSION_ERROR
APPROVAL_REJECTED
SUBAGENT_ERROR
TIMEOUT
CANCELLED
INTERNAL_ERROR
```

Runtime phải normalize error trước khi trả lên Conversation Runtime.

---

## 22. Runtime Rules

1. Agent Runtime không phụ thuộc UI.
2. Sub-agent dùng chung runtime với Main Agent.
3. Execution phải có ID riêng.
4. Child execution phải link parent execution.
5. Không dùng global mutable execution state.
6. Tool phải resolve qua Tool Router.
7. MCP call phải đi qua MCP Gateway.
8. High-risk action phải hỗ trợ pause / approval / resume.
9. Retry phải giới hạn.
10. Destructive tool không retry mù.
11. Runtime phải hỗ trợ timeout.
12. Runtime phải hỗ trợ cancellation.
13. Context phải được assemble có chọn lọc.
14. Chỉ expose allowed tools cho Agent.
15. Trace không lưu private chain-of-thought.
16. Runtime state phải độc lập với frontend state.

## Persistence Model

Execution persistence schema xem:

```text
docs/DATA_MODEL.md
```

Các model chính:

```text
AgentExecution
AgentExecutionStep
ApprovalRequest
UsageRecord
```
