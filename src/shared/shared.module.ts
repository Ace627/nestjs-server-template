import { Global, Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { SharedService } from '@/shared/shared.service'
import { APP_GUARD } from '@nestjs/core'

@Global()
@Module({
  imports: [
    /* 导入速率限制模块   ttl: 单位毫秒， 表示 ttl 秒内最多只能请求 limit 次， 避免暴力攻击 */
    ThrottlerModule.forRoot([{ name: 'short', ttl: 0.01 * 60 * 1000, limit: 60 }]),
  ],
  providers: [
    SharedService,
    /** 速率限制守卫 */
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [SharedService],
})
export class SharedModule {}
