# NestJS 简介

NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 TypeScript（但仍然允许开发者使用纯 JavaScript 编写代码），并结合了 OOP（面向对象编程）、FP（函数式编程）和 FRP（函数式响应式编程）的元素。

## 核心特性

1.  **完美支持 TypeScript**：NestJS 本身就是用 TypeScript 编写的，因此它提供了极佳的类型安全性和开发体验。
2.  **依赖注入 (DI)**：内置了强大的依赖注入系统，使得组件之间的解耦和测试变得非常容易。
3.  **模块化架构**：通过模块（Modules）来组织代码，有助于将应用分割成独立的、可复用的部分。
4.  **灵活的底层 HTTP 平台**：默认使用 Express，但也提供了与 Fastify 的兼容性，允许开发者根据需求选择底层框架。
5.  **装饰器 (Decorators)**：大量使用装饰器来定义类的角色（如 `@Controller`, `@Injectable`, `@Module`），使代码更加简洁和声明式。

## 核心概念

### 1. Modules (模块)
模块是具有 `@Module()` 装饰器的类。`@Module()` 装饰器提供了元数据，Nest 用它来组织应用程序结构。每个 Nest 应用程序至少有一个模块，即根模块 (Root Module)。

### 2. Controllers (控制器)
控制器负责处理传入的请求并将响应返回给客户端。它们使用 `@Controller()` 装饰器定义，并使用如 `@Get()`, `@Post()` 等装饰器来处理特定的 HTTP 请求。

### 3. Providers (提供者)
Provider 是 Nest 的基本概念。许多基本的 Nest 类可能被视为 provider - service, repository, factory, helper 等等。它们可以通过构造函数注入依赖关系。通常使用 `@Injectable()` 装饰器标记。

## 快速开始

安装 Nest CLI：

```bash
npm i -g @nestjs/cli
```

创建一个新项目：

```bash
nest new project-name
```

## 示例代码

一个简单的控制器示例：

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

## 总结

NestJS 提供了一个开箱即用的应用程序架构，允许开发者和团队创建高度可测试、可扩展、松散耦合且易于维护的应用程序。它深受 Angular 的启发，为 Node.js 后端开发带来了结构化和规范化的开发模式。
