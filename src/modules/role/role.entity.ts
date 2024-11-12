import { CommonEntity } from '@/common'
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { MenuEntity } from '../menu/menu.entiy'

@Entity('sys_role')
export class RoleEntity extends CommonEntity {
  @Column({ comment: '角色编码', unique: true })
  code: string

  @Column({ comment: '角色名称', default: null })
  name: string

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[]

  @ManyToMany(() => MenuEntity, (menu) => menu.roles)
  @JoinTable({ name: 'sys_role_menu', joinColumns: [{ name: 'roleId' }], inverseJoinColumns: [{ name: 'menuId' }] })
  menus: RoleEntity[]
}
