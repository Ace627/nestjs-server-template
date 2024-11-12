import { Controller, Get, Post, Query, Body, Headers } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto, UpdateMenuDto } from './menu.dto'
import { AuthEnum } from '@/common'

@Controller('system/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 新增一个菜单
   */
  @Post('create')
  create(@Body() createDto: CreateMenuDto, @Headers(AuthEnum.PAYLOAD) payload: JwtPayload) {
    createDto.createBy = payload.username
    createDto.updateBy = payload.username
    return this.menuService.create(createDto)
  }

  /**
   * 根据 ID 更新单个菜单
   */
  @Post('update')
  update(@Body() updateDto: UpdateMenuDto, @Headers(AuthEnum.PAYLOAD) payload: JwtPayload) {
    updateDto.updateBy = payload.username
    return this.menuService.update(updateDto)
  }

  /**
   * 查询父级菜单下拉列表
   */
  @Get('findParentList')
  findParentList() {
    return this.menuService.findParentList()
  }

  /**
   * 查询树状菜单列表
   */
  @Get('findTreeList')
  findTreeList() {
    return this.menuService.findTreeList()
  }

  /**
   * 根据 ID 查询单个菜单
   */
  @Get('detail')
  findOneById(@Query('menuId') menuId: string) {
    return this.menuService.findOneById(menuId)
  }

  /**
   * 根据 ID 删除单个菜单
   */
  @Get('delete')
  deleteOneById(@Query('menuId') menuId: string) {
    return this.menuService.deleteOneById(menuId)
  }
}
