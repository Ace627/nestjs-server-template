export enum ConfigEnum {
  /** 服务器配置 */
  SERVER = 'server',

  /** 数据库配置 */
  DATABASE = 'database',

  /** Redis 连接配置 */
  REDIS = 'redis',

  /** Token 环境配置 */
  JWT = 'jwt',

  /** Token 有效时长 */
  JWT_EXPIRESIN = 'jwt.signOptions.expiresIn',
}
