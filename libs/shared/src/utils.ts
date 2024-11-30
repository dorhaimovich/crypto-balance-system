import * as path from 'path';
import * as fs from 'fs';
import { LoggerService } from './logger/logger.service';

const getDirPath = async (dirPath: string): Promise<string> => {
  const dataDir = path.resolve(process.cwd(), dirPath);
  if (!fs.existsSync(dataDir)) {
    await fs.promises.mkdir(dataDir);
  }
  return dataDir;
};

const getFormattedTimeStamp = () => {
  return Intl.DateTimeFormat('he-IL', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'Asia/Jerusalem',
  }).format(new Date());
};

const logRequest = (
  user: string,
  ip: string,
  methodName: string,
  serviceName: string,
): void => {
  const logger = new LoggerService(serviceName);

  logger.log(
    `User '${user}' made an API request from IP address '${ip}'`,
    methodName,
  );
};

export { getDirPath, getFormattedTimeStamp, logRequest };
