# NestJS 通用后端框架

一个集成了数据库、Redis 和多环境配置的通用后端框架，帮助开发人员快速搭建和开发高效、可维护的后端服务。

## 项目特点

- **数据库集成**：支持 MySQL、PostgreSQL 等关系型数据库的集成和配置
- **Redis 集成**：内置 Redis 支持，用于缓存、会话管理、消息队列等功能
- **多环境配置**：支持开发、测试、生产环境的配置文件，方便环境切换和管理
- **全局配置管理**：使用 NestJS 的配置模块统一管理和加载配置文件
- **模块化设计**：通过模块化的结构，确保代码清晰且可维护，便于扩展
- **内置 JWT 验证机制**：提供基础的 JWT 认证功能，支持登录验证、权限控制等
- **灵活的日志系统**：内置日志模块，可以记录详细的请求日志、错误日志等

## 项目初始化

```bash
# 拉取代码
git clone https://github.com/Ace627/nestjs-server-template.git
# 安装依赖
pnpm i
# 启动开发环境
pnpm start:dev
```

- [配套接口文档](https://doc.apipost.net/docs/3b200d4f0cde000?locale=zh-cn)

## 常见问题

### 1、如何连接到数据库？

于根目录下的 `config` 目录修改 `config.yaml` 中的 `database` 字段即可

### 2、如何使用全局编译选项？

NestJS 提供了全局编译选项，可以配置一些常见的 CLI 命令选项。详细文档请参考 [全局编译选项](http://nestjs.inode.club/cli/monorepo#全局编译选项)
