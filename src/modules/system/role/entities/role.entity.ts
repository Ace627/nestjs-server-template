import { Entity } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'

@Entity('sys_role')
export class RoleEntity extends BaseEntity {}
