import playwright from "playwright";

async function walk(
  browserName: string,
  browser: playwright.Browser
): Promise<void> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://google.com");

  await page.screenshot({ path: `google-${browserName}.png`, fullPage: true });
  await browser.close();
}

async function main(): Promise<void> {
  const browsers = [playwright.chromium, playwright.firefox, playwright.webkit];

  for await (const browser of browsers) {
    await walk(browser.name(), await browser.launch());
  }
}

main();

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
