import { IsNotEmpty } from 'class-validator'

/**
 * 利用账号密码登录所需的请求体数据参数
 */
export class LoginAccountDto {
  /** 登录账号 */
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  username: string

  /** 登录密码 */
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  password: string

  /** 验证码的校验结果 */
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  captcha: string

  /** 验证码的唯一标识 */
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  uuid: string
}
