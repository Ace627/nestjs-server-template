/**
 * 自定义配置文件
 * http://nestjs.inode.club/techniques/configuration#自定义配置文件
 */
export function configuration() {
  // 解构 MySQL 相关配置
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USERNAME, MYSQL_SYNCHRONIZE } = process.env

  return {
    database: {
      type: 'mysql', // 表示要连接的数据库类型，例如 mysql oracle sqlite mongodb
      host: MYSQL_HOST, // 数据库服务器地址
      port: parseInt(MYSQL_PORT, 10), // 数据库服务器端口
      username: MYSQL_USERNAME, // 数据库服务器的用户名
      password: MYSQL_PASSWORD, // 数据库服务器的密码
      database: MYSQL_DATABASE, // 表示你需要连接到数据库名
      retryAttempts: 10, // 尝试连接数据库的次数 (默认值: 10)
      retryDelay: 3000, // 连接重试之间的延迟（毫秒） (默认值: 3000)
      autoLoadEntities: true, // 如果是 true, 将自动加载实体（默认值: false)
      synchronize: MYSQL_SYNCHRONIZE === 'true', // 表示在应用启动时是否自动创建和更新数据库结构（生产环境中禁止开启，应该使用数据迁移）
      logging: false, // 用于启动日志记录，记录实际执行了哪些 SQL 语句
      timezone: '+08:00', // 时区配置 东八区
    },
  }
}
