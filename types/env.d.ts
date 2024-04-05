interface IConfig {
  /** 服务器监听端口 */
  SERVER_PORT?: number
  /** 全局路由前缀 */
  SERVER_GLOBAL_PREFIX?: string
  /** 登录验证码有效期 单位秒 */
  SERVER_CAPTCHA_TIMEOUT?: number

  /** 数据库地址 */
  SERVER_DB_HOST?: string
  /** 数据库端口 */
  SERVER_DB_PORT?: number
  /** 数据库名称 */
  SERVER_DB_NAME?: string
  /** 数据库账号 */
  SERVER_DB_USERNAME?: string
  /** 数据库密码 */
  SERVER_DB_PASSWORD?: string

  /** Jwt Token 密钥 */
  SERVER_TOKEN_SECRET?: string
  /** Jwt Token 在 Redis 中的过期时间 */
  SERVER_TOKEN_TIMEOUT?: string
  /** Jwt Token 本身的过期时间 */
  SERVER_LOCAL_TOKEN_TIMEOUT?: string

  /** Redis 地址 */
  SERVER_REDIS_HOST?: string
  /** Redis 端口 */
  SERVER_REDIS_PORT?: number
  /** Redis 密码 */
  SERVER_REDIS_PASSWORD?: string
}
