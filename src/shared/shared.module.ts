import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { Global, Logger, Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { RedisModule } from '@nestjs-modules/ioredis'
import { SharedService } from '@/shared/shared.service'
import { AllExceptionsFilter } from '@/common/filters/all-exception.filter'
import { ReponseTransformInterceptor } from '@/common/interceptors/reponse-transform.interceptor'

@Global()
@Module({
  imports: [
    /** 连接 MySQL 数据库 */
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('SERVER_DB_TYPE'),
        host: configService.get<string>('SERVER_DB_HOST'),
        port: configService.get<number>('SERVER_DB_PORT'),
        database: configService.get<string>('SERVER_DB_NAME'),
        username: configService.get<string>('SERVER_DB_USERNAME'),
        password: configService.get<string>('SERVER_DB_PASSWORD'),
        retryAttempts: 10, // 尝试连接数据库的次数 (默认值: 10)
        retryDelay: 3000, // 连接重试之间的延迟（毫秒） (默认值: 3000)
        autoLoadEntities: configService.get<boolean>('SERVER_DB_AUTOLOAD'), // 如果是 true, 将自动加载实体（默认值: false)
        timezone: '+08:00', // 东八区
      }),
      inject: [ConfigService],
    }),
    /** 连接 Redis */
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        options: {
          host: configService.get<string>('SERVER_REDIS_HOST'),
          port: configService.get<number>('SERVER_REDIS_PORT'),
          password: configService.get<string>('SERVER_REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    /* 导入速率限制模块   ttl: 单位毫秒， 表示 ttl 秒内最多只能请求 limit 次， 避免暴力攻击 */
    ThrottlerModule.forRoot([{ name: 'short', ttl: 1 * 60 * 1000, limit: 60 }]),
  ],
  providers: [
    SharedService,
    /** 全局异常过滤器 */
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    /** 全局返回值转化拦截器 */
    { provide: APP_INTERCEPTOR, useClass: ReponseTransformInterceptor },
    /** 速率限制守卫 */
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [SharedService],
})
export class SharedModule {}
