import { getopt } from 'stdio';
import { UrlsInterceptor } from './services/urls-interceptor';
import { Downloader } from './services/downloader';

const options = getopt({
  url: {
    description: 'URL',
    required: true,
    args: 1,
  },
  'pages-number': {
    description: 'Number of pages',
    required: true,
    args: 1,
  },
});

async function run() {
  try {
    const url = options?.url as string;
    const pagesNumber = options?.['pages-number'] as number;

    const urlsInterceptor = new UrlsInterceptor();
    const downloader = new Downloader();

    for (let index = 1; index <= pagesNumber; index++) {
      const name = (index + '').padStart(2, '0');
      const fullUrl = `${url}/${name}.html`;
      const urls = await urlsInterceptor.interceptAsync(fullUrl);
      const path = `${__dirname}/files/${name}`;
      await downloader.downloadFilesAsync(urls, path);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
