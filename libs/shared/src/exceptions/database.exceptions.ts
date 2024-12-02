class DBInstanceCreationFailedException extends Error {
  constructor() {
    super(`Database Error: Unable to create an instance of JsonDB`);
    this.name = 'DBInstanceCreationFailedException';
  }
}

class GetDataException extends Error {
  constructor() {
    super(`Database Error: Failed to retrieve data from the database`);
    this.name = 'GetDataException';
  }
}

class SetDataException extends Error {
  constructor() {
    super(`Database Error: Failed to set data in the database`);
    this.name = 'SetDataException';
  }
}

class RemoveDataException extends Error {
  constructor() {
    super(`Database Error: Failed to delete data from the database`);
    this.name = 'RemoveDataException';
  }
}

export {
  DBInstanceCreationFailedException,
  GetDataException,
  SetDataException,
  RemoveDataException,
};
