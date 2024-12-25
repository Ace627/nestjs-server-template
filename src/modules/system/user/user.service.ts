import argon2 from 'argon2'
import { Injectable } from '@nestjs/common'
import { UserEntity, ApiException } from '@/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Equal, FindOptionsWhere, Like, Repository } from 'typeorm'
import { CreateUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  /** 创建新用户 */
  public async create(createDto: CreateUserDto): Promise<string> {
    // 检查用户是否已存在
    const user = await this.userRepository.findOneBy({ username: Equal(createDto.username) })
    if (user) throw new ApiException(`用户 ${createDto.username} 已存在`)
    //  处理密码
    createDto.password = await argon2.hash(createDto.password || '123456')
    // 保存用户
    await this.userRepository.save(createDto)
    return '添加成功'
  }

  /** 根据用户账号查询用户 */
  public async findUserByUsername(username: string): Promise<Pick<UserEntity, 'id' | 'username' | 'password'>> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.password'])
      .where('user.username = :username', { username })
      .andWhere('user.status = 1')
      .getOne()
    if (!user) throw new ApiException(`用户 ${username} 不存在或已停用`)
    return user
  }

  /** 根据传入 id 组删除单个或者多个数据 */
  public async delete(userIds: string[]) {
    return this.userRepository.delete(userIds)
  }
}
