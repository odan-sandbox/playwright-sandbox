import { Capturer } from "./capturer";

async function main(): Promise<void> {
  const capturer = new Capturer();
  await capturer.init();

  capturer.capture("https://google.com");
}

main();

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
