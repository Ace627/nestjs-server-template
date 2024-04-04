import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { Global, Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { SharedService } from '@/shared/shared.service'
import { AllExceptionsFilter } from '@/common/filters/all-exception.filter'
import { ReponseTransformInterceptor } from '@/common/interceptors/reponse-transform.interceptor'

@Global()
@Module({
  imports: [
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
