import { parseGraphQLPayload } from "../../helpers/parser.js";
import type { Ad, PageMeta } from "../../interfaces/ads.js";
import { captureGraphQLResponses } from "../puppeteerService.js";
import { loadAds, loadMeta, saveAds, saveMeta } from "../storageService.js";

export const incrementalSync = async (pageId: string) => {
  //   info("Starting incremental sync....", { pageId });
  const meta = await loadMeta(pageId);
  if (!meta?.source_url) {
    throw new Error("meta.json missing or invalid");
  }

  const existing = await loadAds(pageId);
  const map = new Map(existing.map((a: Ad) => [a.ad_id, a]));

  const lastSynced = meta.last_synced
    ? new Date(meta.last_synced).getTime()
    : 0;

  const updated: Ad[] = [];

  const onPayLoad = async (payload: any) => {
    const parsed = parseGraphQLPayload(payload);
    for (const ad of parsed) {
      const existingAd = map.get(ad.ad_id);
      const updatedTs = ad.last_seen
        ? new Date(ad.last_seen).getTime()
        : Date.now();

      if (!existingAd) {
        map.set(ad.ad_id, ad);
        updated.push(ad);
      } else if (updatedTs > lastSynced) {
        const merged = { ...existingAd, ...ad };
        map.set(ad.ad_id, merged);
        updated.push(merged);
      } else {
        //
      }
    }
  };

  await captureGraphQLResponses(meta.source_url, onPayLoad, {
    timeoutMs: 25000,
  });
  const final = Array.from(map.values());
  await saveAds(pageId, final);
  meta.last_synced = new Date().toISOString();
  meta.last_ad_count = final.length;
  await saveMeta(pageId, meta);

  //   info("Incremental sync finished", {
  //     pageId,
  //     updated: updated.length,
  //     total: final.length,
  //   });
  return { pageId, updated: updated.length, total: final.length };
};
