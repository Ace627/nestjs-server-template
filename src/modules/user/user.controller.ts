import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './user.dto'
import { TableQuery } from '@/common'
import { UserEntity } from './user.entity'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 新建一条用户数据 */
  @Post('create')
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto)
  }

  /** 删除单个用户数据 */
  @Get('deleteOneById')
  deleteOneById(@Query('userId') userId: string) {
    return this.userService.deleteOneById(userId)
  }

  /** 查询单个用户数据 */
  @Get('findOneById')
  findOneById(@Query('userId') userId: string) {
    return this.userService.findOneById(userId)
  }

  /** 查询用户不分页列表 */
  @Get('findAll')
  findAll() {
    return this.userService.findAll()
  }

  /** 查询用户分页列表 */
  @Get('findList')
  findList(@TableQuery() queryParams: TableQueryParams<UserEntity>) {
    return this.userService.findList(queryParams)
  }
}
