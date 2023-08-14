import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { LoggingService } from 'src/logger/logging.service';
import { Roles } from './constants';
import { ROLES_META } from './decorators';

type UserRequest = {
  user?: {
    roles: Roles[];
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly logger: LoggingService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Roles[]>(ROLES_META, context.getHandler());
    if (!roles) {
      return true;
    }
    const user = context.switchToHttp().getRequest<UserRequest>().user;
    return this.matchRoles(roles, user?.roles ?? []);
  }

  private matchRoles(roles: Roles[], userRoles: Roles[]): boolean {
    const result = roles.some((r) => userRoles.includes(r));
    this.logger.warn(
      `roles matcher: user roles [${userRoles}], allowed roles [${roles}], result ${result}`,
      RolesGuard.name,
    );
    // TODO return match result
    return true;
  }
}
