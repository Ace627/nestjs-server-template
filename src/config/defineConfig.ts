import type { RedisModuleOptions } from '@nestjs-modules/ioredis'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'

/** 用于智能提示 */
export const defineConfig = (config: IConfig): IConfig => config

/** 环境变量的类型声明 */
export interface IConfig {
  /** 服务器监听端口 */
  port?: number
  /** 全局路由前缀 */
  globalPrefix?: string
  /** 是否演示环境守卫 */
  isDemoEnvironment?: boolean
  /** 登录验证码有效期 单位秒 */
  captchaTimeout?: number

  /** MySQL 数据库配置 */
  database?: TypeOrmModuleOptions
  /** Redis 配置 */
  redis?: RedisModuleOptions
}
