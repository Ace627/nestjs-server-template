/**
 * @description 数据库基类
 */
import dayjs from 'dayjs'
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, AfterLoad } from 'typeorm'

export class BaseEntity {
  @Column({ comment: '显示排序', default: 1 })
  order: number

  @Column({ comment: '备注信息', default: '' })
  remark: string

  @Column({ comment: '创建人', length: 30, default: '' })
  createBy: string

  @Column({ comment: '更新人', length: 30, default: '' })
  updateBy: string

  /** 特殊列，自动为实体插入日期。无需设置此列，该值将自动设置 */
  @CreateDateColumn({ comment: '创建时间', update: false })
  create_time: Date | string

  /** 特殊列，在每次调用实体管理器或存储库的 save 时，自动更新实体日期。无需设置此列，该值将自动设置 */
  @UpdateDateColumn({ comment: '更新时间' })
  update_time: Date | string

  @AfterLoad()
  afterLoad() {
    this.create_time = dayjs(this.create_time).format('YYYY-MM-DD HH:mm:ss')
    this.update_time = dayjs(this.update_time).format('YYYY-MM-DD HH:mm:ss')
  }
}
