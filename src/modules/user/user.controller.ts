import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common'
import { TableQuery, AuthEnum } from '@/common'
import { UserService } from './user.service'
import { CreateUserDto, UpdateUserDto } from './user.dto'
import { UserEntity } from './user.entity'

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 新建一条用户数据 */
  @Post('create')
  create(@Body() createDto: CreateUserDto, @Headers(AuthEnum.PAYLOAD) payload: JwtPayload) {
    createDto.createBy = payload.username ?? 'admin'
    createDto.updateBy = payload.username ?? 'admin'
    return this.userService.create(createDto)
  }

  /** 更新单个用户的数据 */
  @Post('update')
  update(@Body() updateDto: UpdateUserDto, @Headers(AuthEnum.PAYLOAD) payload: JwtPayload) {
    updateDto.updateBy = payload.username
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
    return this.userService.findList(queryParams)
  }

  /** 查询用户不分页列表 */
  @Get('list/all')
  findAll() {
    return this.userService.findAll()
  }
}
