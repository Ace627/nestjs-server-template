import { Entity, Column, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'

/** 表示该类对应数据库中的 "sys_user" 表 */
@Entity('sys_user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number

  @Column({ comment: '账号', unique: true, default: '' })
  username: string

  @Column({ comment: '密码', default: null })
  password: string

  @Column({ comment: '昵称', default: null })
  nickname: string

  @Column({ comment: '姓名', default: null })
  realname: string

  @Column({ comment: '年龄', default: 0 })
  age: number

  @Column({ comment: '手机号码', default: null, length: 11 })
  phone: string

  @Column({ comment: '邮箱', default: null, length: 50 })
  email: string

  @Column({ comment: '最后登录IP', length: 12, default: null })
  loginIp: string
}
