import { HttpException, HttpStatus } from '@nestjs/common';

class NoUserIdException extends HttpException {
  constructor() {
    super('Missing user id', HttpStatus.BAD_REQUEST, {
      description: 'Request sent without user id in header',
    });
  }
}

class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(`User id '${id}' not found!`, HttpStatus.NOT_FOUND, {
      description: 'The user id not found in the database',
    });
  }
}

class AssetNotFoundException extends HttpException {
  constructor(asset: string) {
    super(`Asset '${asset}' not found!`, HttpStatus.NOT_FOUND, {
      description: 'The user does not have this asset',
    });
  }
}
class AssetAlreadyExistException extends HttpException {
  constructor(asset: string) {
    super(`Asset '${asset}' already exist!`, HttpStatus.BAD_REQUEST, {
      description: 'The user already have this asset',
    });
  }
}
class CurrencyAlreadyExistException extends HttpException {
  constructor(currency: string) {
    super(`Currency '${currency}' already exist!`, HttpStatus.BAD_REQUEST, {
      description: 'The user already have this currency',
    });
  }
}

export {
  NoUserIdException,
  UserNotFoundException,
  AssetNotFoundException,
  AssetAlreadyExistException,
  CurrencyAlreadyExistException,
};
