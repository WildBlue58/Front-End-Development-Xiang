---
name: create-pr
description: 创建具有格式正确标题的 GitHub 拉取请求（PR），以通过 check-pr-title CI 验证。在创建 PR、提交更改以供审查，或当用户说 /pr 或要求创建拉取请求时使用。
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep, Glob
---

# 创建 Pull Request

创建标题符合 n8n `check-pr-title` CI 验证规则的 GitHub PR。

## PR 标题格式

```
<type>(<scope>): <summary>
```

### 类型（必填）

| 类型       | 描述                                             | 更新日志 |
|------------|--------------------------------------------------|----------|
| `feat`     | 新功能                                           | 是       |
| `fix`      | Bug 修复                                         | 是       |
| `perf`     | 性能优化                                         | 是       |
| `test`     | 添加/修正测试                                    | 否       |
| `docs`     | 仅文档                                           | 否       |
| `refactor` | 代码更改（非 bug 修复或功能）                    | 否       |
| `build`    | 构建系统或依赖                                   | 否       |
| `ci`       | CI 配置                                          | 否       |
| `chore`    | 日常任务，维护                                   | 否       |

### 范围（可选但推荐）

- `API` - 公共 API 更改
- `benchmark` - 基准测试 CLI 更改
- `core` - 核心/后端/私有 API
- `editor` - 编辑器 UI 更改
- `* Node` - 特定节点（例如，`Slack Node`，`GitHub Node`）

### 摘要规则

- 使用祈使语气现在时：用 "Add" 而不是 "Added"
- 首字母大写
- 结尾不要加句号
- 不要包含 Ticket ID（例如，N8N-1234）
- 添加 `(no-changelog)` 后缀以从更新日志中排除

## 步骤

1. **检查当前状态**：
   ```bash
   git status
   git diff --stat
   git log origin/master..HEAD --oneline
   ```

2. **分析更改**以确定：
   - 类型：这是什么样的更改？
   - 范围：受影响的包/区域是哪个？
   - 摘要：更改了什么内容？

3. **如果需要，推送分支**：
   ```bash
   git push -u origin HEAD
   ```

4. 使用 gh CLI **创建 PR**，使用 `.github/pull_request_template.md` 中的模板：
   ```bash
   gh pr create --draft --title "<type>(<scope>): <summary>" --body "$(cat <<'EOF'
   ## Summary

   <描述 PR 做了什么以及如何测试。推荐附上照片和视频。>

   ## Related Linear tickets, Github issues, and Community forum posts

   <!-- Link to Linear ticket: https://linear.app/n8n/issue/[TICKET-ID] -->
   <!-- Use "closes #<issue-number>", "fixes #<issue-number>", or "resolves #<issue-number>" to automatically close issues -->

   ## Review / Merge checklist

   - [ ] PR title and summary are descriptive. ([conventions](../blob/master/.github/pull_request_title_conventions.md))
   - [ ] [Docs updated](https://github.com/n8n-io/n8n-docs) or follow-up ticket created.
   - [ ] Tests included.
   - [ ] PR Labeled with `release/backport` (if the PR is an urgent fix that needs to be backported)
   EOF
   )"
   ```

## PR 正文指南

基于 `.github/pull_request_template.md`：

### 摘要部分
- 描述 PR 做了什么
- 解释如何测试更改
- 包含 UI 更改的截图/视频

### 相关链接部分
- 链接到 Linear ticket：`https://linear.app/n8n/issue/[TICKET-ID]`
- 使用关键字链接到 GitHub issue 以自动关闭：
  - `closes #123` / `fixes #123` / `resolves #123`
- 如果适用，链接到社区论坛帖子

### 清单
合并前应处理所有项目：
- PR 标题符合规范
- 文档已更新或已创建后续 ticket
- 包含测试（bug 需要回归测试，功能需要覆盖率）
- 如果需要回移植紧急修复，添加 `release/backport` 标签

## 示例

### 编辑器中的功能
```
feat(editor): Add workflow performance metrics display
```

### 核心中的 Bug 修复
```
fix(core): Resolve memory leak in execution engine
```

### 特定节点的更改
```
fix(Slack Node): Handle rate limiting in message send
```

### 破坏性更改（在冒号前加感叹号）
```
feat(API)!: Remove deprecated v1 endpoints
```

### 无更新日志条目
```
refactor(core): Simplify error handling (no-changelog)
```

### 无范围（影响多个区域）
```
chore: Update dependencies to latest versions
```

## 验证

PR 标题必须匹配此模式：
```
^(feat|fix|perf|test|docs|refactor|build|ci|chore|revert)(\([a-zA-Z0-9 ]+( Node)?\))?!?: .+[^.]$
```

关键验证规则：
- 类型必须是允许的类型之一
- 范围是可选的，但如果存在，必须在括号内
- 破坏性更改的感叹号放在冒号之前
- 摘要如果是英文建议首字母大写
- 摘要结尾不能有句号
