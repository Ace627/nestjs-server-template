import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Equal, FindOptionsWhere, Like, In } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import { ApiException } from '@/common/exceptions/api.exception'

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  /** 新增用户 */
  async create(createUserDto: CreateUserDto) {
    const target = await this.findOneByAccount(createUserDto.account)
    if (!target) throw new ApiException(`账号 ${createUserDto.account} 已存在`)
    const entity = Object.assign(new UserEntity(), createUserDto)
    await this.userRepository.save(entity)
    return '添加成功'
  }

  /** 通过账号查询用户 */
  findOneByAccount(account: string) {
    return this.userRepository.findOneBy({ account: Equal(account) })
  }

  /** 通过用户 ID 查询用户 */
  async findUserById(userId: number) {
    return this.userRepository.findOneBy({ userId: Equal(userId) })
  }

  /** 根据条件分页查询用户列表 */
  async findUserList() {
    const [records, total] = await this.userRepository.findAndCount()
    return { total, records }
  }

  /** 根据 id 删除一个用户 */
  async remove(id: number) {
    await this.userRepository.delete(id)
    return `删除成功`
  }
}
