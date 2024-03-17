import { Urls } from '../models/urls';
import download from 'download';

export class Downloader {
  public async downloadFilesAsync(urls: Urls, dirPath: string): Promise<void> {
    await download(urls.videoUrl.split('?')[0], dirPath, { filename: 'video.mp4' });
    await download(urls.audioUrl.split('?')[0], dirPath, { filename: 'audio.mp4' });
  }
}
