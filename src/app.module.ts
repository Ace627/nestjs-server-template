import { Module } from '@nestjs/common'
import { SharedModule } from '@/shared/shared.module'

@Module({
  imports: [
    /** 公共模块 */
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
