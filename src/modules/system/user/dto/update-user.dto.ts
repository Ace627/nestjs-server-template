import { Exclude } from 'class-transformer'
import { CreateUserDto } from './create-user.dto'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserDto extends CreateUserDto {
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  id: string

  @Exclude()
  username: string

  @Exclude()
  password: string

  @Exclude()
  createBy: string
}
