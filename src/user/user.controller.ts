import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { RolesDecorator } from '../common/decorators/role.decorator';
import { Roles } from '../common/constants';
import { PaginationDto } from '../common/pagination/pagination.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@RolesDecorator(Roles.ADMIN)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.userService.findAllPaginated(pagination);
  }
}
