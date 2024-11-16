class DataBaseException extends Error {
  constructor(message: string) {
    super(`Database Exception: ${message}`);
    this.name = 'DataBaseException';
  }
}

export { DataBaseException };
