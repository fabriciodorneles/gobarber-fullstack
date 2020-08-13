import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
    public async saveFile(file: string): Promise<string> {
        await fs.promises.rename(
            path.resolve(uploadConfig.tmpFolder, file),
            path.resolve(uploadConfig.uploadsFolder, file),
        );
        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        const filepath = path.resolve(uploadConfig.uploadsFolder, file);
        try {
            await fs.promises.stat(filepath);
        } catch {
            return;
        }
        await fs.promises.unlink(filepath);
    }
}
export default DiskStorageProvider;
