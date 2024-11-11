import { Controller, Get, Post, Query, Body, Headers } from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto, UpdateRoleDto } from './role.dto'
import { AuthEnum, TableQuery } from '@/common'
import { RoleEntity } from './role.entity'

@Controller('system/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /** 新建一条角色数据 */
  @Post('create')
  create(@Body() createDto: CreateRoleDto, @Headers(AuthEnum.PAYLOAD) payload: JwtPayload) {
    createDto.createBy = payload.username
    createDto.updateBy = payload.username
    return this.roleService.create(createDto)
  }

  /** 更新单个角色的数据 */
  @Post('update')
  update(@Body() updateDto: UpdateRoleDto, @Headers(AuthEnum.PAYLOAD) payload: JwtPayload) {
    updateDto.updateBy = payload.username
    return this.roleService.update(updateDto)
  }

  /** 删除单个角色数据 */
  @Get('delete')
  deleteOneById(@Query('roleId') roleId: string) {
    return this.roleService.deleteOneById(roleId)
  }

  /** 查询单个角色数据 */
  @Get('detail')
  findOneById(@Query('roleId') roleId: string) {
    return this.roleService.findOneById(roleId)
  }

  /** 查询角色分页列表 */
  @Get('list')
  findList(@TableQuery() queryParams: TableQueryParams<RoleEntity>) {
    return this.roleService.findList(queryParams)
  }

  /** 查询角色不分页列表 */
  @Get('list/all')
  findAll() {
    return this.roleService.findAll()
  }
}
