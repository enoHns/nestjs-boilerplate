import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const contextRoles = this.reflector.getAllAndOverride<Array<string>>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('User with role is required');
    }

    if (!contextRoles.includes(user.role)) {
      throw new UnauthorizedException('User not authorized');
    }

    return true;
  }
}
