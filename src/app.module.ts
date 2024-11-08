import { Module, ValidationPipe } from '@nestjs/common' // 框架核心库
import { APP_GUARD, APP_PIPE, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config' // 第三方库
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ResponseTransformInterceptor } from './interceptor/response-transform.interceptor'
import { AllExceptionsFilter } from './filter/all-exception.filter'
import { SharedModule } from './shared/shared.module'
import { configuration, envFilePath } from './config'
import { LoginModule } from './modules/login/login.module'

@Module({
  imports: [
    /** 配置环境变量 */
    ConfigModule.forRoot({ load: [configuration], envFilePath, isGlobal: true, cache: true }),
    /** 连接 MySQL 数据库 */
    TypeOrmModule.forRootAsync({ useFactory: (configService: ConfigService) => configService.get<TypeOrmModuleOptions>('database'), inject: [ConfigService] }),
    // 导入速率限制模块   ttl: 单位毫秒， 表示 ttl 秒内最多只能请求 limit 次， 避免暴力攻击
    ThrottlerModule.forRoot([{ name: 'short', ttl: 1 * 60 * 1000, limit: 60 }]),
    // 全局模块
    SharedModule,
    // 业务模块
    LoginModule,
  ],

  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }, // 速率限制守卫
    { provide: APP_FILTER, useClass: AllExceptionsFilter }, // 全局异常过滤器
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor }, // 全局返回值转化拦截器（拦截器中的 handle 从下往上执行）
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true, transform: true }) }, // 注册全局 DTO 验证管道
  ],
})
export class AppModule {}
