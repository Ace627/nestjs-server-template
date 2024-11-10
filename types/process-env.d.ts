namespace NodeJS {
  export interface ProcessEnv {
    /** 当前所处环境模式 */
    NODE_ENV: string
    /** 服务器监听的端口 */
    SERVER_PORT: string
    /** 全局路由接口的前缀 */
    SERVER_PREFIX: string

    /** 数据库服务器地址 */
    MYSQL_HOST: string
    /** 数据库服务器端口 */
    MYSQL_PORT: string
    /** 数据库服务器的用户名 */
    MYSQL_USERNAME: string
    /** 数据库服务器的密码 */
    MYSQL_PASSWORD: string
    /** 表示你需要连接到数据库名 */
    MYSQL_DATABASE: string
    /** 表示在应用启动时是否自动创建和更新数据库结构（生产环境中禁止开启，应该使用数据迁移） */
    MYSQL_SYNCHRONIZE: string

    /** Redis 服务器地址 */
    REDIS_HOST: string
    /** Redis 服务器端口 */
    REDIS_PORT: string
    /** Redis 服务器密码 */
    REDIS_PASSWORD: string

    /** Jwt 认证密钥 */
    JWT_SECRET: string
    /** Jwt 凭证过期时间 单位秒 */
    JWT_ACCESS_TIMEOUT: string
  }
}
