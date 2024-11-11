import { PartialType } from '@nestjs/mapped-types'
import { Exclude } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator'

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
  updateBy: string

  @IsOptional()
  @IsPhoneNumber('CN', { message: '手机号码格式错误' }) // CN 表示中国
  phone: string

  @IsArray({ message: 'roleIds 必须为数组类型' })
  @ArrayNotEmpty({ message: '角色组不可为空' })
  roleIds: string[]
}

/** 更新用户所需的参数体 */
export class UpdateUserDto extends CreateUserDto {
  @IsNotEmpty({ message: '用户 id 不可为空' })
  id: string

  @Exclude()
  createBy: string

  @Exclude()
  @IsOptional()
  username: string

  @Exclude()
  password: string
}
