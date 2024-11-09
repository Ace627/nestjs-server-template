import { IsNotEmpty } from 'class-validator'

/** 登录所需要的参数体 */
export class LoginParamsDto {
  @IsNotEmpty({ message: '登录账号不能为空' })
  username: string

  @IsNotEmpty({ message: '登录密码不能为空' })
  password: string

  @IsNotEmpty({ message: '登录验证码不能为空' })
  captcha: string

  @IsNotEmpty({ message: '登录验证码标识不能为空' })
  uuid: string
}
