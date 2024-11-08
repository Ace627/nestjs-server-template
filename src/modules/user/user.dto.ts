import { GenderEnum } from '@/enums'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '用户账号不可为空' })
  username: string

  password: string

  @IsNotEmpty({ message: '用户昵称不可为空' })
  nickname: string

  @IsNotEmpty({ message: '真实姓名不可为空' })
  realname: string

  gender: number

  phone: string
}
