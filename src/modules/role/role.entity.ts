import { CommonEntity } from '@/common'
import { Column, Entity, ManyToMany } from 'typeorm'
import { UserEntity } from '../user/user.entity'

@Entity('sys_role')
export class RoleEntity extends CommonEntity {
  @Column({ comment: '角色编码', unique: true })
  code: string

  @Column({ comment: '角色名称', default: null })
  name: string

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[]
}
