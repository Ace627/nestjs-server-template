import { Module, ValidationPipe } from '@nestjs/common' // core module
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config' // third module
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import configuration from './configuration' // custom module
import { AppController } from './app.controller'
import { SharedModule } from './shared/shared.module'
import { LoginModule } from './modules/login/login.module'
import { SystemModule } from './modules/system/system.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { AllExceptionsFilter, AuditInterceptor, DatabaseModule, TokenModule, JwtAuthGuard, ResponseInterceptor } from './common'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true }), // 配置环境变量
    ThrottlerModule.forRoot([{ name: 'short', ttl: 1 * 60 * 1000, limit: 60 }]), // 导入速率限制模块
    DatabaseModule, // 连接 MySQL 数据库
    TokenModule, //  配置 Json Web Token
    SharedModule, // 全局模块
    SystemModule, // 业务模块 --> 系统管理
    MonitorModule, // 业务模块 --> 系统监控
    LoginModule, // 业务模块 --> 登录
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }, // 接口访问速率限制守卫
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // Jwt 鉴权守卫
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true, transform: true }) }, // 注册全局 DTO 验证管道
    { provide: APP_FILTER, useClass: AllExceptionsFilter }, //  全局异常过滤器
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor }, // createBy updateBy 自动化
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor }, // 全局返回值转化拦截器（拦截器中的 handle 从下往上执行）
  ],
})
export class AppModule {}
