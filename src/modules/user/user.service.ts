import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Equal, FindOptionsWhere, Like, Repository } from 'typeorm'
import { ApiException, TableQueryDto } from '@/common'
import { CreateUserDto, QueryUserListDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async create(createDto: CreateUserDto) {
    const exists = await this.userRepository.existsBy({ username: Equal(createDto.username) })
    if (exists) throw new ApiException('该账号已存在')
    await this.userRepository.save(createDto)
    return '添加成功'
  }

  async deleteOneById(userId: string) {
    const record = await this.userRepository.findOneBy({ id: Equal(userId) })
    if (!record) throw new ApiException('用户不存在或已被删除')
    // if (record.username.toLowerCase() === 'admin') throw new ApiException('你没有删除此账号的权限', HttpStatus.FORBIDDEN)
    if (record.username.toLowerCase() === 'admin') throw new ApiException('管理员账户无法被删除', HttpStatus.FORBIDDEN)
    await this.userRepository.delete(userId)
    return '删除成功'
  }

  async findOneById(userId: string) {
    const exists = await this.userRepository.existsBy({ id: Equal(userId) })
    if (!exists) throw new ApiException('用户不存在或已被删除')
    return this.userRepository.findOneBy({ id: Equal(userId) })
  }

  async findAll() {
    const records = await this.userRepository.find({ where: { status: Equal(1) } })
    records.forEach((item) => delete item.password)
    return records
  }

  async findList(queryParams: QueryUserListDto & TableQueryDto) {
    const { skip, take, username, nickname, realname, phone } = queryParams
    const where: FindOptionsWhere<UserEntity> = {}
    if (username) where.username = Like(`%${username}%`)
    if (nickname) where.nickname = Like(`%${nickname}%`)
    if (realname) where.realname = Like(`%${realname}%`)
    if (phone) where.phone = Like(`%${phone}%`)
    const [records, total] = await this.userRepository.findAndCount({ where, skip, take })
    records.forEach((item) => delete item.password)
    return { total, records }
  }
}
