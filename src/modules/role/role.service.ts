import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from './role.entity'
import { Equal, FindOptionsWhere, Like, Repository } from 'typeorm'
import { CreateRoleDto, UpdateRoleDto } from './role.dto'
import { ApiException } from '@/common'

@Injectable()
export class RoleService {
  constructor(@InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>) {}

  /** 新建一条角色数据 */
  async create(createDto: CreateRoleDto) {
    const record = await this.roleRepository.findOneBy({ code: Equal(createDto.code) })
    if (record) throw new ApiException(`角色${createDto.code}已存在`)
    const entity = Object.assign(new RoleEntity(), createDto)
    await this.roleRepository.save(entity)
    return '添加成功'
  }

  /** 更新单个角色的数据 */
  async update(updateDto: UpdateRoleDto) {
    await this.roleRepository.save(updateDto)
    return '更新成功'
  }

  /** 根据 roleId 删除角色信息 */
  async deleteOneById(roleId: string) {
    const record = await this.roleRepository.findOneBy({ id: Equal(roleId) })
    if (!record) throw new ApiException('角色不存在或已被删除')
    if (record.code.toLowerCase() === 'admin') throw new ApiException('管理员角色无法被删除', HttpStatus.FORBIDDEN)
    await this.roleRepository.delete(roleId)
    return '删除成功'
  }

  /** 根据 roleId 查询角色信息 */
  async findOneById(roleId: string) {
    return this.roleRepository.findOneBy({ id: Equal(roleId) })
  }

  /** 查询角色不分页列表 */
  async findAll() {
    const records = await this.roleRepository.find({ where: { status: Equal(1) }, order: { createTime: 'ASC' } })
    return records
  }

  /** 查询角色分页列表 */
  async findList(queryParams: TableQueryParams<RoleEntity>) {
    const { skip, take, code, name, remark, status } = queryParams
    /* -------------------------------- 准备模糊查询参数 -------------------------------- */
    const where: FindOptionsWhere<RoleEntity> = {}
    if (code) where.code = Like(`%${code}%`)
    if (name) where.name = Like(`%${name}%`)
    if (remark) where.remark = Like(`%${remark}%`)
    if (status) where.status = Equal(+status)
    const [records, total] = await this.roleRepository.findAndCount({ where, skip, take, order: { createTime: 'ASC' } })
    return { total, records }
  }
}
