import { GenderEnum } from '@/common'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '用户账号不可为空' })
  username: string

  @IsOptional()
  password: string = '123456'

  @IsNotEmpty({ message: '用户昵称不可为空' })
  nickname: string

  @IsNotEmpty({ message: '真实姓名不可为空' })
  realname: string

  @IsOptional()
  gender: number = GenderEnum.UNKNOWN

  @IsOptional()
  avatar: string = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'

  phone: string
}
