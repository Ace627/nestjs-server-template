import { GenderEnum } from '@/common'
import { PartialType } from '@nestjs/mapped-types'
import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator'

/** 新建用户所需的参数体 */
export class CreateUserDto {
  @IsNotEmpty({ message: '用户账号不可为空' })
  username: string

  @IsOptional()
  password: string

  @IsNotEmpty({ message: '用户昵称不可为空' })
  nickname: string

  @IsNotEmpty({ message: '真实姓名不可为空' })
  realname: string

  @IsOptional()
  age: number

  @IsOptional()
  gender: number

  @IsOptional()
  avatar: string

  @IsOptional()
  createBy: string

  @IsOptional()
  @IsPhoneNumber('CN', { message: '手机号码格式错误' }) // CN 表示中国
  phone: string
}

/** 更新用户所需的参数体 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: '用户 id 不可为空' })
  id: string

  @IsOptional()
  updateBy: string

  @Exclude()
  createBy: string

  @Exclude()
  username: string

  @Exclude()
  password: string
}
