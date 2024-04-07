import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'

/** 表示该类对应数据库中的 "sys_role" 表 */
@Entity('sys_role')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '角色id', type: 'int' })
  roleId: number

  @Column({ comment: '角色名称', length: 30 })
  roleName: string
}
