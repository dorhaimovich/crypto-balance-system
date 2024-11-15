import { HttpException, HttpStatus } from '@nestjs/common';

class NoUserIdException extends HttpException {
  constructor(ip: string) {
    super(`Missing user id sent from ip '${ip}'`, HttpStatus.BAD_REQUEST);
  }
}

class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(`User id '${id}' not found!`, HttpStatus.NOT_FOUND);
  }
}

class UserAlreadyExistException extends HttpException {
  constructor(userId: string) {
    super(`User ID '${userId}' already exist!`, HttpStatus.BAD_REQUEST);
  }
}

class IdentifierNotFoundException extends HttpException {
  constructor(coin: string) {
    super(`coin '${coin}' not found!`, HttpStatus.NOT_FOUND);
  }
}

class AssetAlreadyExistException extends HttpException {
  constructor(coin: string) {
    super(`Coin '${coin}' already exist!`, HttpStatus.BAD_REQUEST);
  }
}

class InsufficientBalanceException extends HttpException {
  constructor() {
    super(
      'The user does not have enough balance from that coin',
      HttpStatus.BAD_REQUEST,
    );
  }
}

class SymbolCoinMisMatch extends HttpException {
  constructor() {
    super('the symbol does not match to the coin', HttpStatus.BAD_REQUEST);
  }
}

export {
  NoUserIdException,
  UserNotFoundException,
  UserAlreadyExistException,
  IdentifierNotFoundException,
  AssetAlreadyExistException,
  InsufficientBalanceException,
  SymbolCoinMisMatch,
};
