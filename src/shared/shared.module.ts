import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { Global, Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { SharedService } from '@/shared/shared.service'
import { AllExceptionsFilter } from '@/common/filters/all-exception.filter'

@Global()
@Module({
  imports: [
    /* 导入速率限制模块   ttl: 单位毫秒， 表示 ttl 秒内最多只能请求 limit 次， 避免暴力攻击 */
    ThrottlerModule.forRoot([{ name: 'short', ttl: 1 * 60 * 1000, limit: 6 }]),
  ],
  providers: [
    SharedService,
    /** 全局异常过滤器 */
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    /** 速率限制守卫 */
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [SharedService],
})
export class SharedModule {}
