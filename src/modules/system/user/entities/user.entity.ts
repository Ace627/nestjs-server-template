import { Entity, Column, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'

/** 表示该类对应数据库中的 "sys_user" 表 */
@Entity('sys_user')
export class UserEntity extends BaseEntity {
  @Column({ comment: '账号', unique: true, default: '' })
  account: string

  @Column({ comment: '密码', default: '' })
  password: string

  @Column({ comment: '昵称', default: '' })
  nickname: string

  @Column({ comment: '年龄', default: 0 })
  age: number

  @Column({ comment: '手机号码', default: '' })
  phone: string

  @Column({ comment: '邮箱', default: '' })
  email: string
}
