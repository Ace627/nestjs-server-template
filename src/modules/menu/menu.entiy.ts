import { CommonEntity } from '@/common'
import { Column, Entity, ManyToMany } from 'typeorm'
import { RoleEntity } from '../role/role.entity'

@Entity('sys_menu')
export class MenuEntity extends CommonEntity {
  @Column({ comment: '上级菜单', default: '0' })
  parentId: string

  @Column({ comment: '路由地址', default: null })
  path: string

  @Column({ comment: '组件路径', default: null })
  component: string

  @Column({ comment: '类型（M目录 C菜单 F按钮）', default: 'M' })
  type: string

  @Column({ comment: '菜单图标', default: null })
  icon: string

  @Column({ comment: '菜单名称', default: null })
  title: string

  @Column({ comment: '菜单是否可见', default: 1 })
  visible: number

  @Column({ comment: '是否外链', default: 0 })
  frame: number

  @Column({ comment: '权限字符串', default: null })
  permission: string

  @ManyToMany(() => RoleEntity, (role) => role.menus)
  roles: RoleEntity[]
}
