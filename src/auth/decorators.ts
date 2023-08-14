import { SetMetadata } from '@nestjs/common';
import { Roles, RolesMetadata } from '../auth/constants';

export const SetRoles = (...roles: Roles[]) =>
  SetMetadata(RolesMetadata, roles);
