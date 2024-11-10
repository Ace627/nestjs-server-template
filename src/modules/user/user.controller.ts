import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { TableQuery } from '@/common'
import { UserService } from './user.service'
import { CreateUserDto, UpdateUserDto } from './user.dto'
import { UserEntity } from './user.entity'

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 新建一条用户数据 */
  @Post('create')
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto)
  }

  /** 更新单个用户的数据 */
  @Post('update')
  update(@Body() updateDto: UpdateUserDto) {
    return this.userService.update(updateDto)
  }

  /** 删除单个用户数据 */
  @Get('delete')
  deleteOneById(@Query('userId') userId: string) {
    return this.userService.deleteOneById(userId)
  }

  /** 查询单个用户数据 */
  @Get('detail')
  findOneById(@Query('userId') userId: string) {
    return this.userService.findOneById(userId)
  }

  /** 查询用户分页列表 */
  @Get('list')
  findList(@TableQuery() queryParams: TableQueryParams<UserEntity>) {
    console.log('queryParams: ', queryParams)
    return this.userService.findList(queryParams)
  }

  /** 查询用户不分页列表 */
  @Get('list/all')
  findAll() {
    return this.userService.findAll()
  }
}
