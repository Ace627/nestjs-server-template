import { Column, Entity } from 'typeorm'
import { CommonEntity } from '@/common'

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

  @Column({ comment: '用户性别', default: null })
  gender: number

  // 用户状态 1 正常 2 停用
  @Column({ comment: '用户状态', default: 1 })
  status: number
}
