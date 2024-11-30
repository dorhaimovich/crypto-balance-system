import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { NoUserIdException } from '../exceptions/http.exceptions';

@Injectable()
class UserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    const ip = request.ip;

    if (!userId) {
      throw new NoUserIdException(ip);
    }

    return true;
  }
}

export const RequireUserId = () => {
  return UseGuards(UserIdGuard);
};
