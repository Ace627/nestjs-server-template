/**
 * @description 测试环境配置文件
 */
import { defineConfig } from './defineConfig'

export default defineConfig({
  /** 服务器监听端口 */
  port: 3000,
  /** 登录验证码有效期 单位秒 */
  captchaTimeout: 300,
  // 是否演示环境
  isDemoEnvironment: false,
  /** MySQL 数据库配置 */
  database: {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'web-blog',
    username: 'root',
    password: 'root123456',
    retryAttempts: 10, // 尝试连接数据库的次数 (默认值: 10)
    retryDelay: 3000, // 连接重试之间的延迟（毫秒） (默认值: 3000)
    autoLoadEntities: true, // 如果是 true, 将自动加载实体（默认值: false)
    synchronize: true,
    timezone: '+08:00', // 东八区
  },
  /** Redis 配置 */
  redis: {
    type: 'single',
    options: {
      host: '127.0.0.1',
      port: 6379,
      password: '123456789',
    },
  },
})
