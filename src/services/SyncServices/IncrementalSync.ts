import { parseGraphQLPayload } from "../../helpers/parser";
import type { Ad } from "../../interfaces/ads";
import { captureGraphQLResponses } from "../puppeteerService";
import { loadAds, loadMeta, saveAds, saveMeta } from "../storageService";
import { info, error } from "../../helpers/logger";

// Incremental sync function to update ads data
export const incrementalSync = async (pageId: string) => {
  info("Starting incremental sync....", { pageId });
  // load existing meta data
  const meta = await loadMeta(pageId);
  if (!meta?.source_url) {
    error("meta.json missing or invalid");
    return;
  }
  // load existing ads data
  const existing = await loadAds(pageId);
  // map existing ads by ad_id for quick lookup
  const map = new Map(existing.map((a: Ad) => [a.ad_id, a]));
  const lastSynced = meta.last_synced
    ? new Date(meta.last_synced).getTime()
    : 0;

  const updated: Ad[] = [];

  //  function to handle each GraphQL payload
  const onPayLoad = async (payload: any) => {
    const parsed = parseGraphQLPayload(payload);
    // process each ad in the parsed payload
    for (const ad of parsed) {
      const existingAd = map.get(ad.ad_id);
      const updatedTs = ad.last_seen
        ? new Date(ad.last_seen).getTime()
        : Date.now();

      // determine if the ad is new or updated
      if (!existingAd) {
        map.set(ad.ad_id, ad);
        updated.push(ad);
        // new ads
      } else if (updatedTs > lastSynced) {
        const merged = { ...existingAd, ...ad };
        map.set(ad.ad_id, merged);
        updated.push(merged);
      } else {
        // already up-to-date... skip
      }
    }
  };

  // capture GraphQL responses and process them
  await captureGraphQLResponses(meta.source_url, onPayLoad, {
    timeoutMs: 25000,
  });
  // save the updated ads and meta data
  const final = Array.from(map.values());
  await saveAds(pageId, final);
  meta.last_synced = new Date().toISOString();
  meta.last_ad_count = final.length;
  await saveMeta(pageId, meta);

  info("Incremental sync finished", {
    pageId,
    updated: updated.length,
    total: final.length,
  });
  // return summary of the sync operation
  return { pageId, updated: updated.length, total: final.length };
};
