import { Capturer } from "./capturer";
import { ImageMatcher } from "./image-matcher";

async function main(): Promise<void> {
  const url = "https://google.com";
  console.log("url", url);

  const capturer = new Capturer();
  await capturer.init();

  const paths = await capturer.capture(url);
  const pairs = paths.reduce<[string, string][]>((prev, cur, i) => {
    const partial = paths
      .filter((_, j) => i < j)
      .map<[string, string]>((path) => [cur, path]);
    return [...prev, ...partial];
  }, []);

  const matcher = new ImageMatcher();

  for await (const pair of pairs) {
    const error = await matcher.match(pair);
    console.log(`${error}: ${pair[0]} - ${pair[1]}`);
  }
}

main();

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
