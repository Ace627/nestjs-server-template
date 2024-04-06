import type { RedisModuleOptions } from '@nestjs-modules/ioredis'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'

/** 用于智能提示 */
export const defineConfig = (config: IConfig): IConfig => config

/** 环境变量的类型声明 */
export interface IConfig {
  /** 服务器监听端口 */
  SERVER_PORT?: number
  /** 全局路由前缀 */
  SERVER_GLOBAL_PREFIX?: string
  /** 登录验证码有效期 单位秒 */
  SERVER_CAPTCHA_TIMEOUT?: number
  /** MySQL 数据库配置 */
  database?: TypeOrmModuleOptions
  /** Redis 配置 */
  redis?: RedisModuleOptions
}
