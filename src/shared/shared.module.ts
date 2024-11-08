import { Module, Global } from '@nestjs/common'
import { SharedService } from './shared.service'
import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [SharedService, RedisService],
  exports: [SharedService, RedisService],
})
export class SharedModule {}
