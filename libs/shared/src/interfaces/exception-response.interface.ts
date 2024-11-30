export interface ExceptionsResponseObject {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  response: string | object;
}
