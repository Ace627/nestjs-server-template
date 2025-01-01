import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigEnum } from '../enum/config.enum'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const runtimeConfig = configService.get<DatabaseConfig>(ConfigEnum.DATABASE)
        return {
          // 表示要连接的数据库类型，例如 mysql oracle sqlite mongodb
          type: 'mysql',
          // 数据库服务器地址
          host: runtimeConfig.host,
          // 数据库服务器端口
          port: runtimeConfig.port,
          // 数据库服务器的用户名
          username: runtimeConfig.username,
          // 数据库服务器的密码
          password: runtimeConfig.password,
          // 表示你需要连接到数据库名
          database: runtimeConfig.database,
          // 表示在应用启动时是否自动创建和更新数据库结构
          synchronize: runtimeConfig.synchronize,
          // 是否需要自动加载实体
          autoLoadEntities: true,
          // 时区配置 东八区
          timezone: '+08:00',
          // 连接重试之间的延迟（毫秒） (默认值: 3000)
          retryDelay: 3000,
          // 尝试连接数据库的次数 (默认值: 10)
          retryAttempts: 10,
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
