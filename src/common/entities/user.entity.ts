import { Entity, Column } from 'typeorm'
import { CommonEntity } from './common.entity'
import { GenderEnum } from '../enum/gender.enum'

@Entity('sys_user')
export class UserEntity extends CommonEntity {
  @Column({ comment: '账号', unique: true })
  username: string

  @Column({ comment: '密码', default: null })
  password: string

  @Column({ comment: '真实姓名', default: null })
  realname: string

  @Column({ comment: '昵称', default: null })
  nickname: string

  @Column({ comment: '头像', default: null })
  avatar: string

  @Column({ comment: '性别', default: GenderEnum.UNKNOWN })
  gender: number

  @Column({ comment: '手机号码', default: null })
  phone: string

  @Column({ comment: '用户年龄', default: null })
  age: number
}
