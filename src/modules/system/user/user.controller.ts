import { Body, Controller, Delete, ParseArrayPipe, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto'
import { AutoAudit, Public } from '@/common'

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @AutoAudit()
  @Post('create')
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto)
  }

  @Delete('delete')
  delete(@Query('userIds', new ParseArrayPipe()) userIds: string[]) {
    return this.userService.delete(userIds)
  }
}
