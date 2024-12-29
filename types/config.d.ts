interface DatabaseConfig {
  /** 数据库服务器地址 */
  host: string
  /** 数据库服务器端口 */
  port: number
  /** 数据库服务器的用户名 */
  username: string
  /** 数据库服务器的密码 */
  password: string
  /** 表示你需要连接到数据库名 */
  database: string
  /** 表示在应用启动时是否自动创建和更新数据库结构（生产环境中禁止开启，应该使用数据迁移） */
  synchronize: boolean
}

interface ServerConfig {
  /** 服务监听端口 默认 3000 */
  port: number
  /** 全局路由前缀 默认 /api */
  globalPrefix: string
}

interface JwtConfig {
  /** 指定用于签名和验证 JWT 的密钥 */
  secret: string
  /** 设置令牌的过期时间。可以是 string（如 '60m'、'2d'）或者 number（秒） | 这里直接统一用秒了 */
  expiresIn: number
}

interface RedisConfig {
  url: string
  password: string
}
