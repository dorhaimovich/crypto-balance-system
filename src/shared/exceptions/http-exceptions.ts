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

class UserAlreadyExistException extends HttpException {
  constructor(userId: string) {
    super(`User ID '${userId}' already exist!`, HttpStatus.BAD_REQUEST, {
      description: 'The user already exist',
    });
  }
}

class IdentifierNotFoundException extends HttpException {
  constructor(identifier: string) {
    super(
      `Asset or currency '${identifier}' not found!`,
      HttpStatus.NOT_FOUND,
      {
        description: 'The user does not have this coin or currency',
      },
    );
  }
}

class AssetAlreadyExistException extends HttpException {
  constructor(coin: string) {
    super(`Asset '${coin}' already exist!`, HttpStatus.BAD_REQUEST, {
      description: 'The user already have this coin',
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
class InsufficientBalanceException extends HttpException {
  constructor(amount: number, identifier: string) {
    super(
      'The user does not have enough balance from that currency',
      HttpStatus.BAD_REQUEST,
      {
        description: `there is only '${amount} ${identifier}'`,
      },
    );
  }
}

export {
  NoUserIdException,
  UserNotFoundException,
  UserAlreadyExistException,
  IdentifierNotFoundException,
  AssetAlreadyExistException,
  CurrencyAlreadyExistException,
  InsufficientBalanceException,
};
