import { Module } from '@nestjs/common'
import { LoginService } from './login.service'
import { LoginController } from './login.controller'
import { UserModule } from '../user/user.module'
import { RoleModule } from '../role/role.module'

@Module({
  imports: [UserModule, RoleModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
