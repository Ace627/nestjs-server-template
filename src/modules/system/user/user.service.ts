import argon2 from 'argon2'
import { Injectable } from '@nestjs/common'
import { UserEntity, ApiException } from '@/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Equal, FindOptionsWhere, Like, Repository } from 'typeorm'
import { CreateUserDto, UpdateUserDto } from './dto'

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

  /** 修改用户个人信息 */
  public async update(updateDto: UpdateUserDto): Promise<string> {
    await this.userRepository.save(updateDto)
    return '更新成功'
  }

  /** 根据用户 ID 查找用户信息 */
  public async findUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: Equal(userId) })
    if (!user) throw new ApiException(`用户不存在或已停用`)
    Reflect.deleteProperty(user, 'password')
    return user
  }

  /** 根据用户账号查询用户 */
  public async findUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ username: Equal(username), status: Equal(1) })
    if (!user) throw new ApiException(`用户 ${username} 不存在或已停用`)
    return user
  }

  /** 根据传入 id 组删除单个或者多个数据 */
  public async delete(userIds: string[]) {
    return this.userRepository.delete(userIds)
  }
}
