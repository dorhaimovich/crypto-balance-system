import * as path from 'path';
import * as fs from 'fs';

export { getDirPath, getFormattedTimeStamp };

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
