import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateMenuDto {
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  parentId: string

  @IsNotEmpty({ message: '参数 $property 不可为空' })
  type: string

  @IsNotEmpty({ message: '参数 $property 不可为空' })
  title: string

  @IsOptional()
  permission: string

  @IsOptional()
  path: string

  @IsOptional()
  icon: string

  @IsOptional()
  order: number

  @IsOptional()
  status: number

  @IsOptional()
  frame: number

  @IsOptional()
  component: string

  @IsOptional()
  createBy: string

  @IsOptional()
  updateBy: string
}

export class UpdateMenuDto extends CreateMenuDto {
  @IsNotEmpty({ message: '菜单 id 不可为空' })
  id: string

  @Exclude()
  createBy: string
}

export class FindTreeListDto {
  @IsOptional()
  title: string

  @IsOptional()
  status: number
}
