import { type ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth.controller';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: AuthenticatedUser }>();
    return request.user;
  },
);
