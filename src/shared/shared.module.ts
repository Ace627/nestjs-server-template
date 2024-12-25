import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { CaptchaService } from './captcha.service'

@Global()
@Module({
  providers: [RedisService, CaptchaService],
  exports: [RedisService, CaptchaService],
})
export class SharedModule {}
