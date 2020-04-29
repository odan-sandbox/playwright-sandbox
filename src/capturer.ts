import fs from "fs";
import { parse } from "url";
import { join } from "path";

import playwright from "playwright";

export type CapturerOptions = {
  directory?: string;
};

export class Capturer {
  private readonly browsers: {
    [name: string]: playwright.BrowserType<playwright.Browser>;
  } = {};
  private initialized = false;
  private options: Required<CapturerOptions>;
  constructor(options?: CapturerOptions) {
    this.options = {
      directory: options?.directory || "images",
    };
  }

  public async capture(url: string): Promise<string[]> {
    if (!this.initialized) {
      throw new Error("should be call init");
    }

    const paths: string[] = [];
    const hostname = parse(url).hostname;

    for await (const name of Object.keys(this.browsers)) {
      const browserType = this.browsers[name];
      const browser = await browserType.launch();
      const page = await browser.newPage();

      const path = join(this.options.directory, `${hostname}-${name}.png`);
      paths.push(path);

      await page.goto(url);
      await page.screenshot({
        path,
        fullPage: true,
      });

      await browser.close();
    }

    return paths;
  }

  public async init(): Promise<void> {
    const browsers = [
      playwright.chromium,
      playwright.firefox,
      playwright.webkit,
    ];

    for await (const browser of browsers) {
      const name = browser.name();
      this.browsers[name] = browser;
    }

    await new Promise((resolve, reject) => {
      fs.mkdir(this.options.directory, { recursive: true }, (err, path) => {
        if (err) {
          return reject(err);
        }
        return resolve(path);
      });
    });

    this.initialized = true;
  }

  public get browserNames(): string[] {
    return Object.keys(this.browsers);
  }
}
