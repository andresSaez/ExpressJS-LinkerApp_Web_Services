import fs from 'fs';
import path from 'path';
const download = require('image-downloader');

export default class ImageService {
    static saveImage(dir: any, photo: any) {
        const data = photo.split(',')[1] || photo;
        return new Promise((resolve, reject) => {
            const filePath = path.join('public/img', dir, `${Date.now()}.jpg`);
            fs.writeFile(filePath, data, {encoding: 'base64'}, (err: any) => {
                if (err) reject(err);
                resolve(filePath);
            });
        });
    }

    static async downloadImage(dir: any, url: any) {
        const filePath = path.join('public/img', dir, `${Date.now()}.jpg`);
        await download.image({
            url,
            dest: filePath,
        });
        return filePath;
    }
}