import { HttpException, HttpStatus } from '@nestjs/common';

class NoUserIdException extends HttpException {
  constructor(ip: string) {
    super(
      `The API request from IP address '${ip}' is missing the required 'X-User-ID' header.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(`The user with ID '${id}' was not found.`, HttpStatus.NOT_FOUND);
  }
}

class CoinNotFoundException extends HttpException {
  constructor(coin: string) {
    super(`The coin '${coin}' was not found.`, HttpStatus.NOT_FOUND);
  }
}

class CoinAlreadyExistException extends HttpException {
  constructor(coin: string) {
    super(
      `The coin '${coin}' already exists. Duplicate entries are not allowed.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

class InsufficientBalanceException extends HttpException {
  constructor(coin: string) {
    super(
      `The user does not have enough ${coin} balance to complete this operation.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

class SymbolCoinMismatchException extends HttpException {
  constructor(coin: string, symbol: string) {
    super(
      `The symbol '${symbol}' does not match the expected symbol for coin '${coin}'.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

class InvalidTargetPercentageException extends HttpException {
  constructor() {
    super(
      'Invalid target percentages. The sum of all percentages must equal exactly 100%.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

class UnsupportedCoinsException extends HttpException {
  constructor(coins: string[]) {
    super(
      `The following coins are not supported: ${coins.join(', ')}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export {
  NoUserIdException,
  UserNotFoundException,
  CoinNotFoundException,
  CoinAlreadyExistException,
  InsufficientBalanceException,
  SymbolCoinMismatchException,
  InvalidTargetPercentageException,
  UnsupportedCoinsException,
};
