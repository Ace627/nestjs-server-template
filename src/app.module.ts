import { Module, ValidationPipe } from '@nestjs/common' // core module
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt' // third module
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import configuration from './configuration' // custom module
import { AppController } from './app.controller'
import { SharedModule } from './shared/shared.module'
import { AllExceptionsFilter, ConfigEnum, ResponseInterceptor } from './common'
import { MonitorModule } from './modules/monitor/monitor.module'

@Module({
  imports: [
    // 配置环境变量
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true }),
    // 导入速率限制模块   ttl: 单位毫秒， 表示 ttl 秒内最多只能请求 limit 次， 避免暴力攻击
    ThrottlerModule.forRoot([{ name: 'short', ttl: 1 * 60 * 1000, limit: 60 }]),
    // 连接 MySQL 数据库
    TypeOrmModule.forRootAsync({ useFactory: (configService: ConfigService) => configService.get<TypeOrmModuleOptions>(ConfigEnum.DATABASE), inject: [ConfigService] }),
    //  配置 Json Web Token
    JwtModule.registerAsync({ useFactory: (configService: ConfigService) => configService.get<JwtModuleOptions>(ConfigEnum.JWT), global: true, inject: [ConfigService] }),
    // 全局模块
    SharedModule,
    // 业务模块 --> 系统监控
    MonitorModule,
  ],
  controllers: [AppController],
  providers: [
    // 速率限制守卫
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // 注册全局 DTO 验证管道
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true, transform: true }) },
    //  全局异常过滤器
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    // 全局返回值转化拦截器（拦截器中的 handle 从下往上执行）
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
