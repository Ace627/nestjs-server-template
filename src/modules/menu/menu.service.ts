import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager, Equal } from 'typeorm'
import { CreateMenuDto } from './menu.dto'
import { MenuEntity } from './menu.entiy'
import { ApiException } from '@/common'

@Injectable()
export class MenuService {
  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {}

  /**
   * 新增一个菜单
   */
  async create(createDto: CreateMenuDto) {
    if (createDto.type === 'M' || createDto.type === 'C') {
      const record = await this.entityManager.findOneBy(MenuEntity, { path: Equal(createDto.path) })
      if (record) throw new ApiException(`路由 ${createDto.path} 已存在`)
    } else if (createDto.type === 'F') {
      const record = await this.entityManager.findOneBy(MenuEntity, { permission: Equal(createDto.permission) })
      if (record) throw new ApiException(`按钮权限${createDto.permission}已存在`)
    }
    const entity = Object.assign(new MenuEntity(), createDto)
    await this.entityManager.save(MenuEntity, entity)
    return '添加成功'
  }

  /**
   * 根据 ID 查询单个菜单
   */
  findOneById(menuId: string) {
    return this.entityManager.findOneBy(MenuEntity, { id: Equal(menuId) })
  }
}
