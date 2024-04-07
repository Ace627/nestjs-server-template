import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { Global, Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { RedisModule, type RedisModuleOptions } from '@nestjs-modules/ioredis'
import { SharedService } from '@/shared/shared.service'
import { AllExceptionsFilter } from '@/common/filters/all-exception.filter'
import { ReponseTransformInterceptor } from '@/common/interceptors/reponse-transform.interceptor'
import { DemoEnvironmentGuard } from '@/common/guards/demo-environment.guard'

@Global()
@Module({
  imports: [
    /** 连接 MySQL 数据库 */
    TypeOrmModule.forRootAsync({ useFactory: (configService: ConfigService) => configService.get<TypeOrmModuleOptions>('database'), inject: [ConfigService] }),
    /** 连接 Redis */
    RedisModule.forRootAsync({ useFactory: (configService: ConfigService) => configService.get<RedisModuleOptions>('redis'), inject: [ConfigService] }),
    /* 导入速率限制模块   ttl: 单位毫秒， 表示 ttl 秒内最多只能请求 limit 次， 避免暴力攻击 */
    ThrottlerModule.forRoot([{ name: 'short', ttl: 1 * 60 * 1000, limit: 60 }]),
  ],
  providers: [
    SharedService,
    /** 全局异常过滤器 */
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    /** 是否演示环境守卫 */
    { provide: APP_GUARD, useClass: DemoEnvironmentGuard },
    /** 全局返回值转化拦截器 */
    { provide: APP_INTERCEPTOR, useClass: ReponseTransformInterceptor },
    /** 速率限制守卫 */
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [SharedService],
})
export class SharedModule {}
