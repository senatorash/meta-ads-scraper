import mockPayload from "./mocks/mocksGraphQlAds.json";
import { parseGraphQLPayload } from "../src/helpers/parser";

// Tests for the parseGraphQLPayload function
describe("parseGraphQLPayload", () => {
  // test to ensure ads are extracted correctly and important fields are present
  test("extracts ads correctly and important fields", () => {
    const ads = parseGraphQLPayload(mockPayload);
    expect(ads.length).toBeGreaterThan(0);

    const ad = ads[0];
    expect(typeof ad.ad_id).toBe("string");
    expect(typeof ad.page_id).toBe("string");
    expect(typeof ad.ad_text).toBe("string");
    expect(typeof ad.image_urls).toBe("string");
    expect(typeof ad.is_active).toBe("boolean");
    expect(ad.start_date).toBeDefined();
    expect(ad.end_date).toBeDefined();
    expect(ad.raw).toBeDefined();
  });

  // test to handle empty payloads safely
  test("handles empty payload safely", () => {
    const ads = parseGraphQLPayload({});
    expect(ads).toEqual([]);
  });

  // test to handle missing edges safely
  test("handles missing edges safely", () => {
    const ads = parseGraphQLPayload({ data: { ad_library_main: {} } });
    expect(ads).toEqual([]);
  });

  // test to detect if the Facebook GraphQL schema has changed
  test("detect schema changes automatically (GraphQL breaking change)", () => {
    const brokenPayload = {
      data: {
        ad_library_main: {
          // search_results_connection is missing
        },
      },
    };
    const ads = parseGraphQLPayload(brokenPayload);
    expect(ads.length).toBe(0);
  });

  // test to ensure the structure of the Facebook API has not changed
  test("Facebook API has not changed structure", () => {
    const ads = parseGraphQLPayload(mockPayload);

    expect(Object.keys(ads[0])).toEqual([
      "ad_id",
      "page_id",
      "ad_text",
      "image_urls",
      "is_active",
      "start_date",
      "end_date",
      "raw",
      "last_seen",
    ]);
  });
});
