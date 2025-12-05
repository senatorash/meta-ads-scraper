import puppeteer, { Page } from "puppeteer";

export const createBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  return browser;
};

export const captureGraphQLResponses = async (
  url: string,
  onPayLoad: (payload: any) => Promise<void>,
  options?: { timeoutMs?: number }
) => {
  const browser = await createBrowser();
  const page = await browser.newPage();

  await page.setRequestInterception(false);

  page.on("response", async (response) => {
    try {
      const req = response.request();
      const urlStr = response.url();
      if (urlStr.includes("/api/grapgql") || urlStr.includes("/graphql")) {
        const text = await response.text();
        const json = JSON.parse(text);
        await onPayLoad(json);
      }
    } catch (err) {}
  });

  await page.goto(url, { waitUntil: "networkidle2" });
  await new Promise((resolve) =>
    setTimeout(resolve, options?.timeoutMs ?? 2000)
  );
};
