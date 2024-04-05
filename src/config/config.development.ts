/**
 * @description 测试环境配置文件
 */
import { defineConfig } from './defineConfig'

export default defineConfig({
  SERVER_PORT: 3000,

  SERVER_CAPTCHA_TIMEOUT: 300,

  // MySQL 数据库配置
  SERVER_DB_TYPE: 'mysql',
  SERVER_DB_HOST: '127.0.0.1',
  SERVER_DB_PORT: 3306,
  SERVER_DB_NAME: 'unknown-trove',
  SERVER_DB_USERNAME: 'unknown-trove',
  SERVER_DB_PASSWORD: '123456789',
  SERVER_DB_AUTOLOAD: true,
  SERVER_DB_SYNCHRONIZE: true,

  // Redis 配置
  SERVER_REDIS_HOST: '127.0.0.1',
  SERVER_REDIS_PORT: 6379,
  SERVER_REDIS_PASSWORD: '123456789',
})
