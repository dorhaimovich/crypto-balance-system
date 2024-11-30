import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { getDirPath, getFormattedTimeStamp } from '../utils';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private async logToFile(
    fileName: string,
    logType: string,
    message: any,
    ctx: string,
  ): Promise<void> {
    const formattedEntry = `[${getFormattedTimeStamp()}] [${logType.toUpperCase()}] [${ctx}] ${message}\n`;

    try {
      const logsDir = await getDirPath('logs');
      await fs.promises.appendFile(
        path.join(logsDir, fileName),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, context: string): void {
    const fileName = 'logs.log';
    this.logToFile(fileName, 'log', message, `${this.context}.${context}`);
    super.log(message, context);
  }

  error(message: string | object, context: string): void {
    const fileName = 'errors.log';
    this.logToFile(fileName, 'error', message, `${this.context}.${context}`);
    super.error(message, context);
  }
}
