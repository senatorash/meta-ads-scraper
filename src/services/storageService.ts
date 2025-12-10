import fs from "fs/promises";
import path from "path";

// Directory to store data files
const DATA_DIR = path.resolve(process.cwd(), "data");

// Save ads data to a JSON file
export const saveAds = async (pageId: string, ads: any[]) => {
  const dir = path.join(DATA_DIR, pageId);
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, "ads.json");
  // to avoid data corruption
  await fs.writeFile(file + ".tmp", JSON.stringify(ads, null));
  await fs.rename(file + ".tmp", file);
};

// Load ads data from a JSON file
export const loadAds = async (pageId: string) => {
  const file = path.join(DATA_DIR, pageId, "ads.json");
  try {
    const content = await fs.readFile(file, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

// Save metadata to a JSON file
export const saveMeta = async (pageId: string, meta: any) => {
  const file = path.join(DATA_DIR, pageId, "meta.json");
  await fs.writeFile(file, JSON.stringify(meta, null, 2));
};

// Load metadata from a JSON file
export const loadMeta = async (pageId: string) => {
  const file = path.join(DATA_DIR, pageId, "meta.json");
  try {
    return JSON.parse(await fs.readFile(file, "utf-8"));
  } catch (err) {
    return {};
  }
};
