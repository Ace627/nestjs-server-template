import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginParameterDto {
  @ApiProperty({ description: '登录账号', example: 'someone' })
  @IsNotEmpty({ message: '登录账号不能为空' })
  username: string

  @ApiProperty({ description: '登录密码', example: 'some123456' })
  @IsNotEmpty({ message: '登录密码不能为空' })
  password: string

  @ApiProperty({ description: '登录验证码', example: 'kHwn' })
  @IsNotEmpty({ message: '登录验证码不能为空' })
  captcha: string

  @ApiProperty({ description: '登录验证码标识', example: 'ae0857d3-e6fb-43c1-9abf-a86e38068e5a' })
  @IsNotEmpty({ message: '登录验证码标识不能为空' })
  uuid: string
}
