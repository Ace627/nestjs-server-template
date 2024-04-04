import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedModule } from '@/shared/shared.module'
import configuration from './config/configuration'

@Module({
  imports: [
    /** 配置环境变量 http://nestjs.inode.club/techniques/configuration */
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    /** 公共模块 */
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
