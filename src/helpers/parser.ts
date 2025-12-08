import type { Ad } from "../interfaces/ads";

export const parseGraphQLPayload = (payLoad: any): Ad[] => {
  const ads: Ad[] = [];

  try {
    // Navigate the payload structure to find ads data
    const adEdges =
      payLoad?.data?.ad_library_main?.search_results_connection?.edges ?? [];
    console.log("Parsing payload with", adEdges.length, "ads");

    if (!Array.isArray(adEdges)) return ads;

    for (const adEdge of adEdges) {
      const node = adEdge?.node?.collated_results[0];
      if (!node) continue;

      //   extract ad details
      const adId =
        node.ad_id ?? node?.ad_archive_id ?? node?.collation_id ?? null;

      const pageId = node?.page_id ?? null;
      const ad_text = node?.snapshot?.body?.text ?? null;
      const image_urls = node?.snapshot?.cards[0]?.original_image_url;
      const is_active = node?.is_active ?? false;
      const start_date = node?.start_date
        ? new Date(node.start_date * 1000).toISOString()
        : null;
      const end_date = node?.end_date
        ? new Date(node.end_date * 1000).toISOString()
        : null;

      ads.push({
        ad_id: String(adId),
        page_id: String(pageId),
        ad_text,
        image_urls,
        is_active,
        start_date,
        end_date,
        raw: node,
        last_seen: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    console.warn("Parser error:", err.message);
  }
  return ads;
};
