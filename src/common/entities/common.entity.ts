import dayjs from 'dayjs'
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, AfterLoad } from 'typeorm'

export abstract class CommonEntity {
  // 防止被恶意推算 id
  @PrimaryGeneratedColumn('uuid', { comment: '主键' })
  id: string

  // 数据状态 1 正常 0 停用
  @Column({ comment: '数据状态', default: 1 })
  status: number

  @Column({ comment: '显示顺序', type: 'int', default: 1 })
  order: number

  @Column({ comment: '创建者', name: 'create_by', default: null })
  createBy: string

  @Column({ comment: '更新者', name: 'update_by', default: null })
  updateBy: string

  @Column({ comment: '备注', default: null })
  remark: string

  /** 特殊列，自动为实体插入日期。无需设置此列，该值将自动设置 */
  @CreateDateColumn({ name: 'create_time', comment: '创建时间', update: false, type: 'timestamp' })
  createTime: Date | string

  /** 特殊列，在每次调用实体管理器或存储库的 save 时，自动更新实体日期。无需设置此列，该值将自动设置 */
  @UpdateDateColumn({ name: 'update_time', comment: '更新时间', type: 'timestamp' })
  updateTime: Date | string

  @AfterLoad()
  afterLoad() {
    this.createTime = dayjs(this.createTime).format('YYYY-MM-DD HH:mm:ss')
    this.updateTime = dayjs(this.updateTime).format('YYYY-MM-DD HH:mm:ss')
  }
}
