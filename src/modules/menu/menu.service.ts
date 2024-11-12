import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Equal, FindOptionsWhere, Not, Repository } from 'typeorm'
import { CreateMenuDto, UpdateMenuDto } from './menu.dto'
import { MenuEntity } from './menu.entiy'
import { ApiException } from '@/common'
import { transformListToTree } from '@/utils/tree-helper'

@Injectable()
export class MenuService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(MenuEntity) private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  /**
   * 新增一个菜单
   */
  async create(createDto: CreateMenuDto) {
    if (createDto.type === 'M' || createDto.type === 'C') {
      const record = await this.menuRepository.findOneBy({ path: Equal(createDto.path) })
      if (record) throw new ApiException(`路由 ${createDto.path} 已存在`)
    } else if (createDto.type === 'F') {
      const record = await this.menuRepository.findOneBy({ permission: Equal(createDto.permission) })
      if (record) throw new ApiException(`按钮权限${createDto.permission}已存在`)
    }
    const entity = Object.assign(new MenuEntity(), createDto)
    await this.menuRepository.save(entity)
    return '添加成功'
  }

  /**
   * 根据 ID 查询单个菜单
   */
  findOneById(menuId: string) {
    return this.menuRepository.findOneBy({ id: Equal(menuId) })
  }

  /**
   * 查询父级菜单下拉列表
   */
  async findParentList() {
    const where: FindOptionsWhere<MenuEntity> = {} // 查询条件
    where.status = Equal(1)
    where.type = Not('F')
    const records = await this.menuRepository.find({ where, order: { order: 'ASC' } })
    return [{ parentId: '0', id: '0', title: '主类目', children: transformListToTree(records) }]
  }

  /**
   * 查询树状菜单列表
   */
  async findTreeList() {
    const where: FindOptionsWhere<MenuEntity> = {} // 查询条件
    const records = await this.menuRepository.find({ where, order: { order: 'ASC' } })
    return transformListToTree(records)
  }

  /**
   * 根据 ID 更新单个菜单
   */
  async update(updateDto: UpdateMenuDto) {
    console.log('updateDto: ', updateDto)
    await this.menuRepository.save(updateDto)
    return '更新成功'
  }

  /**
   * 根据 ID 删除单个菜单
   */
  async deleteOneById(menuId: string) {
    const record = await this.menuRepository.findOneBy({ id: Equal(menuId) })
    if (!record) throw new ApiException('菜单不存在或已被删除')
    const children = await this.menuRepository.findBy({ parentId: Equal(menuId) })
    if (children && children.length) throw new ApiException('该菜单下还存在其它菜单，无法删除')
    await this.menuRepository.delete(menuId)
    return '删除成功'
  }
}
