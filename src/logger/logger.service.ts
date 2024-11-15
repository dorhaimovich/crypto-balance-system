import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  async logToFile(
    filename: string,
    logType: string,
    message: any,
    ctx: string,
  ) {
    const formattedTimeStamp = Intl.DateTimeFormat('he-IL', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Asia/Jerusalem',
    }).format(new Date());
    const formattedEntry = `[${formattedTimeStamp}] [${logType.toUpperCase()}] [${ctx}] ${message}\n`;

    try {
      const logsDir = path.resolve(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) {
        await fs.promises.mkdir(logsDir);
      }
      await fs.promises.appendFile(
        path.join(logsDir, filename),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, context: string) {
    this.logToFile('logs.log', 'log', message, `${this.context}.${context}`);
    super.log(message, context);
  }

  error(message: string | object, stackOrContext: string) {
    this.logToFile(
      'errors.log',
      'error',
      message,
      `${this.context}.${stackOrContext}`,
    );
    super.error(message, stackOrContext);
  }
}
