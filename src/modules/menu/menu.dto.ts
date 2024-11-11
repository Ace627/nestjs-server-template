import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateMenuDto {
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  parentId: string

  @IsNotEmpty({ message: '参数 $property 不可为空' })
  type: string

  @IsNotEmpty({ message: '参数 $property 不可为空' })
  title: string

  @IsNotEmpty({ message: '参数 $property 不可为空' })
  permission: string

  @IsOptional()
  path: string
}
