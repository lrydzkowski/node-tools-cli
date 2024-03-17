import puppeteer, { Frame } from 'puppeteer';
import { Urls } from '../models/urls';

export class UrlsInterceptor {
  private timeout = 5000;

  public async interceptAsync(url: string): Promise<Urls> {
    let videoUrl = '';
    let audioUrl = '';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 2560,
      height: 576,
    });
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      if (interceptedRequest.isInterceptResolutionHandled()) {
        return;
      }

      const interceptedUrl = interceptedRequest.url();
      if (interceptedUrl.includes('video') && interceptedUrl.includes('.mp4')) {
        videoUrl = interceptedUrl;
      }

      if (interceptedUrl.includes('audio') && interceptedUrl.includes('.mp4')) {
        audioUrl = interceptedUrl;
      }

      interceptedRequest.continue();
    });

    await page.goto(url);
    const iframeElement = await page.waitForSelector('iframe');
    const iframe = await iframeElement?.contentFrame();
    if (!iframe) {
      throw new Error("iframe doesn't exist");
    }

    await this.clickSettingsAsync(iframe);
    await this.clickQualityMenu(iframe);
    await this.clickQualityAsync(iframe);
    await this.clickPlayAsync(iframe);

    await new Promise((r) => setTimeout(r, 5000));
    await iframeElement?.dispose();

    await browser.close();

    return {
      videoUrl,
      audioUrl,
    };
  }

  private async clickSettingsAsync(iframe: Frame): Promise<void> {
    await iframe.locator('button.vp-prefs > svg').setTimeout(this.timeout).click();
    console.log('settings clicked');
  }

  private async clickQualityMenu(iframe: Frame): Promise<void> {
    await iframe.locator('div:nth-of-type(1) > span[class*="Text_module_md__"]').setTimeout(this.timeout).click();
    console.log('quality menu clicked');
  }

  private async clickQualityAsync(iframe: Frame): Promise<void> {
    await iframe.locator('div:nth-of-type(4) li:nth-of-type(2) > span').setTimeout(this.timeout).click();
    console.log('quality clicked');
  }

  private async clickPlayAsync(iframe: Frame): Promise<void> {
    await iframe.locator('button[data-play-button="true"]').setTimeout(this.timeout).click();
    console.log('play clicked');
  }
}
