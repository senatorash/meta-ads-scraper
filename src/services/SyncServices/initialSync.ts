import { parseGraphQLPayload } from "../../helpers/parser";
import type { Ad, PageMeta } from "../../interfaces/ads";
import { captureGraphQLResponses } from "../puppeteerService";
import { saveAds, saveMeta } from "../storageService";
import { info, error } from "../../helpers/logger";

const extractPageIdFromAds = (ads: Ad[]): string | null => {
  if (!ads || ads.length === 0 || !ads[0]) return null;
  return ads[0].page_id ?? null;
};

export const initialSync = async (url: string, max?: number) => {
  info(`Starting initial sync for ${url} with max ${max ?? "unlimited"} ads`);

  //   To avoid duplicates
  const adsMap = new Map<string, Ad>();

  // Capture GraphQL responses
  const onPayLoad = async (payload: any) => {
    const parsedAds = parseGraphQLPayload(payload);
    for (const ad of parsedAds) {
      adsMap.set(ad.ad_id, ad);
    }

    info("Payload parsed", { currentAdsCount: adsMap.size });

    // stop if reached max
    if (max && adsMap.size >= max) {
      return "STOP";
    }
  };

  //   start capture by calling puppeteer service
  await captureGraphQLResponses(url, onPayLoad, { timeoutMs: 30000 });
  const ads = Array.from(adsMap.values());

  if (max) {
    ads.splice(max);
  }

  const pageId = extractPageIdFromAds(ads);
  if (!pageId) {
    error("Unable to extract page ID from parsed ads");
    return;
  }

  await saveAds(pageId, ads);

  const meta: PageMeta = {
    page_id: pageId,
    source_url: url,
    last_synced: new Date().toISOString(),
    last_ad_count: ads.length,
  };
  await saveMeta(pageId, meta);

  info("Initial sync completed", { pageId, ads: ads.length });
};
