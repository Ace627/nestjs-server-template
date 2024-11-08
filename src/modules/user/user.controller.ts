import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CreateUserDto, QueryUserListDto } from './user.dto'
import { TableQuery, TableQueryDto } from '@/common'

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: '新建一条用户数据' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto)
  }

  @Get('deleteOneById')
  @ApiOperation({ summary: '删除单个用户数据' })
  @ApiQuery({ name: 'userId', description: '用户ID' })
  deleteOneById(@Query('userId') userId: string) {
    return this.userService.deleteOneById(userId)
  }
  @Get('findOneById')
  @ApiOperation({ summary: '查询单个用户数据' })
  @ApiQuery({ name: 'userId', description: '用户ID' })
  findOneById(@Query('userId') userId: string) {
    return this.userService.findOneById(userId)
  }

  @Get('findAll')
  @ApiOperation({ summary: '查询用户不分页列表' })
  findAll() {
    return this.userService.findAll()
  }

  @Get('findList')
  @ApiOperation({ summary: '查询用户分页列表' })
  @ApiQuery({ type: QueryUserListDto })
  findList(@TableQuery() queryParams: QueryUserListDto & TableQueryDto) {
    return this.userService.findList(queryParams)
  }
}
