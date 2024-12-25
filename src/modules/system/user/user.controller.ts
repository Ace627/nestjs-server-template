import { AutoAudit } from '@/common'
import { UserService } from './user.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import { Body, Controller, Delete, Get, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AutoAudit()
  @Post('create')
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto)
  }

  @AutoAudit()
  @Put('update')
  update(updateDto: UpdateUserDto) {
    return this.userService.update(updateDto)
  }

  @Get('detail')
  findUserById(@Query('userId') userId: string) {
    return this.userService.findUserById(userId)
  }

  @Delete('delete')
  delete(@Query('userIds', new ParseArrayPipe()) userIds: string[]) {
    return this.userService.delete(userIds)
  }
}
