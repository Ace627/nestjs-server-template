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
  /** Token 密钥 */
  secret: string
  signOptions: {
    /** Token 过期时间 */
    expiresIn: number
  }
}

interface RedisConfig {
  url: string
  password: string
}
