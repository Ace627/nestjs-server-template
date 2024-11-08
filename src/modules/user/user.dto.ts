import { GenderEnum } from '@/enums'
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ type: 'string', default: 'someone', description: '用户账号' })
  @IsNotEmpty({ message: '用户账号不可为空' })
  username: string

  @ApiProperty({ type: 'string', default: '青莲居士', description: '用户昵称' })
  @IsNotEmpty({ message: '用户昵称不可为空' })
  nickname: string

  @ApiProperty({ type: 'string', default: '李白', description: '真实姓名' })
  @IsNotEmpty({ message: '真实姓名不可为空' })
  realname: string

  @ApiPropertyOptional({ type: 'integer', default: GenderEnum.UNKNOWN, description: '用户性别' })
  gender: number

  @ApiPropertyOptional({ type: 'string', default: '17867898765', description: '手机号码' })
  phone: string
}

export class QueryUserListDto extends PickType(CreateUserDto, ['gender', 'nickname', 'username', 'realname', 'phone']) {
  @ApiPropertyOptional({ type: 'integer', default: 1, description: '当前页码数' })
  pageNo: number

  @ApiPropertyOptional({ type: 'integer', default: 10, description: '当前页条目数' })
  pageSize: number

  @ApiProperty({ required: false })
  @IsOptional()
  username: string

  @ApiProperty({ required: false })
  @IsOptional()
  nickname: string

  @ApiProperty({ required: false })
  @IsOptional()
  realname: string
}
