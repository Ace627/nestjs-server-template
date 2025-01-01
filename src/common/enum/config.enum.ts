export enum ConfigEnum {
  /** 服务器配置 */
  SERVER = 'server',

  /** 数据库配置 */
  DATABASE = 'database',

  /** Redis 连接配置 */
  REDIS = 'redis',

  /** 配置生成 JWT 时的选项 */
  JWT = 'jwt',

  /** Token 令牌的有效时长 单位秒 */
  JWT_EXPIRESIN = 'jwt.expiresIn',

  /** 静态资源目录 */
  STATIC_ASSETS_PATH = 'staticAssetsPath',

  /** 静态资源目录访问前缀 */
  STATIC_ASSETS_PREFIX = 'staticAssetsPrefix',
}
