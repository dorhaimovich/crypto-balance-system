import * as path from 'path';
import * as fs from 'fs';

const getDirPath = async (dirPath: string): Promise<string> => {
  const dataDir = path.resolve(process.cwd(), dirPath);
  if (!fs.existsSync(dataDir)) {
    await fs.promises.mkdir(dataDir);
  }
  return dataDir;
};

export { getDirPath };
