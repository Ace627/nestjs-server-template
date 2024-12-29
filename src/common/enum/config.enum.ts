export enum ConfigEnum {
  /** 服务器配置 */
  SERVER = 'server',

  /** 数据库配置 */
  DATABASE = 'database',

  /** Redis 连接配置 */
  REDIS = 'redis',

  /** 配置生成 JWT 时的选项 */
  JWT = 'jwt',
  JWT_EXPIRESIN = 'jwt.expiresIn',
  /** 最终组合的 Jwt 模块配置 */
  JWT_OPTION = 'JWT_OPTION',

  /** 静态资源目录 */
  STATIC_ASSETS_PATH = 'staticAssetsPath',

  /** 静态资源目录访问前缀 */
  STATIC_ASSETS_PREFIX = 'staticAssetsPrefix',
}
