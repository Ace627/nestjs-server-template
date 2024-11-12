import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from './role.entity'
import { EntityManager, Equal, FindOptionsWhere, In, Like, Repository } from 'typeorm'
import { AuthPermissionDto, CreateRoleDto, UpdateRoleDto } from './role.dto'
import { ApiException } from '@/common'
import { MenuEntity } from '../menu/menu.entiy'
import { transformListToTree } from '@/utils/tree-helper'
import { firstToUpper } from '@/utils'
import { flatMapDeep, unionBy } from 'lodash'

@Injectable()
export class RoleService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(MenuEntity) private readonly menuRepository: Repository<MenuEntity>,
  ) {}

  /** 新建一条角色数据 */
  async create(createDto: CreateRoleDto) {
    const record = await this.roleRepository.findOneBy({ code: Equal(createDto.code) })
    if (record) throw new ApiException(`角色${createDto.code}已存在`)
    const entity = Object.assign(new RoleEntity(), createDto)
    await this.roleRepository.save(entity)
    return '添加成功'
  }

  /** 更新单个角色的数据 */
  async update(updateDto: UpdateRoleDto) {
    await this.roleRepository.save(updateDto)
    return '更新成功'
  }

  /** 根据 roleId 删除角色信息 */
  async deleteOneById(roleId: string) {
    const record = await this.roleRepository.findOneBy({ id: Equal(roleId) })
    if (!record) throw new ApiException('角色不存在或已被删除')
    if (record.code.toLowerCase() === 'admin') throw new ApiException('管理员角色无法被删除', HttpStatus.FORBIDDEN)
    await this.roleRepository.delete(roleId)
    return '删除成功'
  }

  /** 根据 roleId 查询角色信息 */
  async findOneById(roleId: string) {
    return this.roleRepository.findOne({ where: { id: Equal(roleId) }, relations: { menus: true } })
  }

  /** 查询角色不分页列表 */
  async findAll() {
    const records = await this.roleRepository.find({ where: { status: Equal(1) }, order: { createTime: 'ASC' } })
    return records
  }

  /** 查询角色分页列表 */
  async findList(queryParams: TableQueryParams<RoleEntity>) {
    const { skip, take, code, name, remark, status } = queryParams
    /* -------------------------------- 准备模糊查询参数 -------------------------------- */
    const where: FindOptionsWhere<RoleEntity> = {}
    if (code) where.code = Like(`%${code}%`)
    if (name) where.name = Like(`%${name}%`)
    if (remark) where.remark = Like(`%${remark}%`)
    if (status) where.status = Equal(+status)
    const [records, total] = await this.roleRepository.findAndCount({ where, skip, take, order: { createTime: 'ASC' } })
    return { total, records }
  }

  /**
   * 为角色分配权限菜单
   */
  async authPermission(authDto: AuthPermissionDto) {
    const menus = await this.findMenuListByMenuIds(authDto.menuIds)
    const role = await this.roleRepository.findOneBy({ id: Equal(authDto.roleId) })
    role.menus = menus
    await this.roleRepository.save(role)
    return '分配成功'
  }

  /**
   * 根据菜单 ID 组获取对应菜单列表 给角色分配权限用
   */
  async findMenuListByMenuIds(menuIds: string[]) {
    return this.entityManager.findBy(MenuEntity, { id: In(menuIds), status: Equal(1) })
  }

  /** 根据角色 id 数组查询拥有的所有菜单 */
  async findMenusByRoleIds(isAdmin: boolean, roleIds: string[]) {
    let records: MenuEntity[] = []
    if (isAdmin) {
      records = await this.menuRepository.find()
    } else {
      const roles = await this.roleRepository.find({ where: { status: Equal(1), id: In(roleIds) }, relations: { menus: true } })
      records = flatMapDeep(roles.map((role) => role.menus))
    }
    const uniqueRecords = unionBy(records, 'id') // 去重
    const sortRecords = uniqueRecords.sort((a, b) => a.order - b.order) // 菜单升序排序
    const menus = sortRecords.filter((v) => v.type === 'M' || v.type === 'C') // 目录、菜单
    const permissions = sortRecords.filter((v) => v.type === 'F') // 按钮权限
    return { menus, permissions }
  }

  generateRoutes(menuList: MenuEntity[]) {
    const menuTreeList = []
    const treeList = transformListToTree<MenuEntity>(menuList)
    for (const item of treeList) {
      if (item.parentId === '0') {
        if (item.type === 'C') {
          const obj = { path: '/', component: 'Layout', children: [JSON.parse(JSON.stringify(item))] }
          menuTreeList.push(obj)
        } else if (item.type === 'M' && item.frame === 1) {
          const obj = { path: item.path, component: 'Layout', children: [JSON.parse(JSON.stringify(item))] } // 适配一级外链
          menuTreeList.push(obj)
        } else {
          menuTreeList.push(item)
        }
      }
    }
    return this.createRouterTree(menuTreeList)
  }

  createRouterTree(menuList: any[]) {
    const routerList: any[] = []
    for (const item of menuList) {
      const route: Record<string, any> = {}
      route.component = item.component
      if (item.path) route.name = firstToUpper(item.path)
      route.path = item.path
      route.meta = {}
      route.meta.title = item.title
      route.meta.icon = item.icon
      route.meta.hidden = item.visible === 0 ? true : false
      // 处理目录类型 M
      if (item.type === 'M') {
        route.component = item.path.includes('/') ? 'Layout' : 'ParentView'
        route.meta.alwaysShow = true
        if (item.frame === 1) route.meta.alwaysShow = false
      }
      if (item.children && item.children.length) route.children = this.createRouterTree(item.children)
      routerList.push(route)
    }
    return routerList
  }
}
