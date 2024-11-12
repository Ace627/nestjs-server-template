import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleEntity } from './role.entity'
import { MenuEntity } from '../menu/menu.entiy'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, MenuEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
