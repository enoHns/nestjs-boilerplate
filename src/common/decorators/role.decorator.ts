
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants';

export const RolesDecorator = (...roles: Array<string>) => SetMetadata(ROLES_KEY, roles);