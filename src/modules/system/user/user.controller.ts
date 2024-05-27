import { Controller, Get, Post, Body, Query, Param, Delete } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 新增用户 */
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  /* 分页查询用户列表 */
  @Get('list')
  findUserList() {
    return this.userService.findUserList()
  }

  /** 根据 id 删除一个用户 */
  @Delete()
  deleteOneById(@Query('id') id: string) {
    return this.userService.deleteOneById(+id)
  }
}
