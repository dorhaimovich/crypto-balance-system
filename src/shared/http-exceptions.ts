import { HttpException, HttpStatus } from '@nestjs/common';

class NoIdException extends HttpException {
  constructor() {
    super('User ID not found!', HttpStatus.BAD_REQUEST, {
      cause: new Error(),
      description: 'Request sent without user id in header',
    });
  }
}

export { NoIdException };
