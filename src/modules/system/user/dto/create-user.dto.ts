import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  username: string

  @IsNotEmpty({ message: '参数 $property 不可为空' })
  password: string

  @IsOptional()
  avatar: string

  @IsOptional()
  gender: number

  @IsOptional()
  age: number

  @IsOptional()
  status: number

  @IsOptional()
  @IsPhoneNumber('CN', { message: '手机号码格式错误' })
  phone: string

  @IsOptional()
  realname: string

  @IsOptional()
  nickname: string

  @IsOptional()
  createBy: string

  @IsOptional()
  updateBy: string
}
