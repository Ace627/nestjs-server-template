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
  JWT_EXPIRESIN = 'jwt.signOptions.expiresIn',
}
