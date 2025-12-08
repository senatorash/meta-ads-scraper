import puppeteer, { Page } from "puppeteer";
import { info, error, success } from "../helpers/logger";

export const createBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });
  return browser;
};

export const captureGraphQLResponses = async (
  url: string,
  onPayLoad: (payload: any) => Promise<"STOP" | void>,
  options?: { timeoutMs?: number }
) => {
  const timeout = options?.timeoutMs ?? 15000;
  const browser = await createBrowser();
  const page = await browser.newPage();

  info("Opening page...", { url });

  await page.setRequestInterception(false);

  let stop = false;

  page.on("response", async (response) => {
    try {
      const urlStr = response.url();

      //   detect graphql responses
      if (urlStr.includes("/api/graphql") || urlStr.includes("/graphql")) {
        const text = await response.text();
        // console.log("Raw GraphQL response:", text);

        let json;

        try {
          json = JSON.parse(text);
        } catch (err) {
          error("Failed to parse JSON Graphql response", { err });
          return;
        }
        const result = await onPayLoad(json);

        if (result === "STOP") {
          stop = true;
        }
      }
    } catch (err: any) {
      error("Error in response handler", { err });
    }
  });

  //   navigate to the page
  await page.goto(url, { waitUntil: "networkidle2" });
  info("Page loaded. Beginning capture...");

  //   Auto-scroll to make Meta Ads Library load more ads
  const start = Date.now();
  while (!stop && Date.now() - start < timeout) {
    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  success("Finished capturing GraphQL payloads", {
    durationMs: Date.now() - start,
  });

  await browser.close();
  info("Browser closed");

  return true;
};
