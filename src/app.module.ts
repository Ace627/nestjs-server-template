import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedModule } from '@/shared/shared.module'
import { LoginModule } from './modules/login/login.module'
import { UserModule } from './modules/system/user/user.module';
import { RoleModule } from './modules/system/role/role.module';
import { ServerModule } from './modules/monitor/server/server.module';
import configuration from './config/configuration'

@Module({
  imports: [
    /** 配置环境变量 http://nestjs.inode.club/techniques/configuration */
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true }),
    /** 公共模块 */
    SharedModule,
    LoginModule,
    UserModule,
    RoleModule,
    ServerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
