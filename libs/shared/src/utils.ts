import * as path from 'path';
import * as fs from 'fs';
import { LoggerService } from '@nestjs/common';

export { formatName, getDirPath, getFormattedTimeStamp, logRequest };

const formatName = (className: string, methodName: string) => {
  return `${className}.${methodName}`;
};

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
  logger: LoggerService,
  user: string,
  ip: string,
  name: string,
): void => {
  logger.log(
    `User '${user}' made an API request from IP address '${ip}'`,
    name,
  );
};
