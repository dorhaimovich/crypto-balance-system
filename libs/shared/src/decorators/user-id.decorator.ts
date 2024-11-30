import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NoUserIdException } from '../exceptions/http.exceptions';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];

    if (!userId) {
      throw new NoUserIdException(request.ip);
    }

    return userId;
  },
);
