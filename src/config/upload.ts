import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    directory: tmpFolder,

    storage: multer.diskStorage({
        // tá usando o _dirname do path para padronizar o diretorio para os diferentes sistemas
        // _dirname te da o caminho do root da máquina ate o root do arquivo de código
        // ai volta 2 '..' (config e src) e entra em 'tmp'
        destination: tmpFolder,
        // tá fazendo isso pra garantir que não tenham 2 arquivos com nome igual
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const filename = `${fileHash}-${file.originalname}`;

            return callback(null, filename);
        },
    }),
};
