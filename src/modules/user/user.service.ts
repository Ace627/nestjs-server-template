import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { EntityManager, Equal, FindOptionsWhere, In, Like, Repository } from 'typeorm'
import { ApiException } from '@/common'
import { CreateUserDto, UpdateUserDto } from './user.dto'
import argon2 from 'argon2'
import { RoleEntity } from '../role/role.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  /** 新建一条用户数据 */
  async create(createDto: CreateUserDto) {
    const record = await this.userRepository.findOneBy({ username: Equal(createDto.username) })
    if (record) throw new ApiException('该账号已存在')
    const entity = Object.assign(new CreateUserDto(), createDto) // 合并默认值并对密码进行加密处理
    entity.password = await argon2.hash(createDto.password ?? '123456')
    await this.userRepository.save(entity)
    return '添加成功'
  }

  /** 更新单个用户的数据 */
  async update(updateDto: UpdateUserDto) {
    const roles = await this.entityManager.findBy(RoleEntity, { id: In(updateDto.roleIds), status: Equal(1) })
    await this.userRepository.save({ ...updateDto, roles })
    return '更新成功'
  }

  /** 根据 userId 删除用户信息 */
  async deleteOneById(userId: string) {
    const record = await this.userRepository.findOneBy({ id: Equal(userId) })
    if (!record) throw new ApiException('用户不存在或已被删除')
    if (record.username.toLowerCase() === 'admin') throw new ApiException('管理员账户无法被删除', HttpStatus.FORBIDDEN)
    await this.userRepository.delete(userId)
    return '删除成功'
  }

  /** 根据用户账号查询用户信息 登录用 */
  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username: Equal(username) })
  }

  /** 根据 userId 查询用户信息 */
  async findOneById(userId: string) {
    const user = await this.entityManager.findOne(UserEntity, { where: { id: Equal(userId) }, relations: { roles: true } })
    const roleIds = user.roles.map((role) => role.id)
    return { ...user, roleIds }
  }

  /** 查询用户不分页列表 */
  async findAll() {
    const records = await this.userRepository.find({ where: { status: Equal(1) } })
    records.forEach((item) => delete item.password)
    return records
  }

  /** 查询用户分页列表 */
  async findList(queryParams: TableQueryParams<UserEntity>) {
    const { skip, take, username, nickname, realname, phone } = queryParams
    /* -------------------------------- 准备模糊查询参数 -------------------------------- */
    const where: FindOptionsWhere<UserEntity> = {}
    if (username) where.username = Like(`%${username}%`)
    if (nickname) where.nickname = Like(`%${nickname}%`)
    if (realname) where.realname = Like(`%${realname}%`)
    if (phone) where.phone = Like(`%${phone}%`)
    const [records, total] = await this.userRepository.findAndCount({ where, skip, take, order: { createTime: 'ASC' } })
    /* ---------------------------------- 不返回密码 --------------------------------- */
    records.forEach((item) => delete item.password)
    return { total, records }
  }
}
