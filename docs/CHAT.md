# Chat

Tài liệu này định nghĩa baseline cho Chat và Conversation.

## 1. Core Flow

```text
User Message
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
  v
Streaming Events
  |
  v
Chat UI
```

## 2. Core Entities

```text
Conversation
Message
AgentExecution
AgentExecutionStep
```

Message không thay thế Agent execution trace.

## 3. Baseline Features

```text
create conversation
send message
stream response
stop generation
regenerate
edit message
archive conversation
delete conversation
attachments
tool-call display
error display
```

Branch conversation có thể bổ sung sau.

## 4. Message Types

```text
user
assistant
system
tool
```

## 5. Streaming Events

Baseline:

```text
message.started
message.delta
message.completed
agent.started
agent.tool_requested
agent.tool_completed
agent.approval_required
agent.completed
agent.failed
```

## 6. Stop Generation

Stop phải gửi cancellation vào Conversation Runtime / Agent Runtime.

Không chỉ dừng render phía client.

## 7. Regenerate

Regenerate phải tạo execution mới và giữ lịch sử rõ ràng.

## 8. Attachments

File upload đi qua backend/storage.

Chat chỉ lưu reference tới File/Knowledge resource.

## 9. Workspace Isolation

Conversation và Message luôn thuộc Workspace.

Mọi query phải scope theo `workspaceId`.

## 10. Chat Rules

- UI không tự gọi LLM.
- UI không tự gọi MCP.
- Streaming protocol phải typed.
- Execution trace tách khỏi Message.
- Cancellation phải propagate xuống runtime.
