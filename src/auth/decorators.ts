import { SetMetadata } from '@nestjs/common';
import { Roles } from '../auth/constants';

export const ROLES_META = 'roles';
export const SKIP_AUTH_META = 'skip_auth';

export const SetRoles = (...roles: Roles[]) => SetMetadata(ROLES_META, roles);
export const SkipAuth = () => SetMetadata(SKIP_AUTH_META, true);
