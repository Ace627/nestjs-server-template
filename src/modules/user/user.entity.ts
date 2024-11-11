import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { CommonEntity, GenderEnum } from '@/common'
import { RoleEntity } from '../role/role.entity'

@Entity('sys_user')
export class UserEntity extends CommonEntity {
  @Column({ comment: '用户账号', unique: true })
  username: string

  @Column({ comment: '用户密码', default: null })
  password: string

  @Column({ comment: '用户昵称', default: null })
  nickname: string

  @Column({ comment: '用户头像', default: null })
  avatar: string

  @Column({ comment: '真实姓名', default: null })
  realname: string

  @Column({ comment: '手机号码', default: null })
  phone: string

  @Column({ comment: '用户年龄', default: null })
  age: number

  @Column({ comment: '用户性别', default: GenderEnum.UNKNOWN })
  gender: number

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({ name: 'sys_user_role', joinColumns: [{ name: 'userId' }], inverseJoinColumns: [{ name: 'roleId' }] })
  roles: RoleEntity[]
}
