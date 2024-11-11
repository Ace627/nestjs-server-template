import { CommonEntity } from '@/common'
import { Column, Entity } from 'typeorm'

@Entity('sys_role')
export class RoleEntity extends CommonEntity {
  @Column({ comment: '角色编码', unique: true })
  code: string

  @Column({ comment: '角色名称', default: null })
  name: string

  // 角色状态 1 正常 2 停用
  @Column({ comment: '角色状态', default: 1 })
  status: number

  @Column({ comment: '角色描述', default: null })
  desc: string
}
