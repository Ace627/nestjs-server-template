import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string

  @IsNotEmpty({ message: '角色编码不能为空' })
  code: string

  @IsOptional()
  remark: string

  @IsOptional()
  createBy: string

  @IsOptional()
  updateBy: string

  @IsOptional()
  status: number
}

export class UpdateRoleDto extends CreateRoleDto {
  @IsNotEmpty({ message: '角色 id 不可为空' })
  id: string

  @Exclude()
  createBy: string
}

export class AuthPermissionDto {
  @IsNotEmpty({ message: '参数 $property 不可为空' })
  roleId: string

  @IsNotEmpty({ message: '参数 $property 不可为空' })
  menuIds: string[]
}
