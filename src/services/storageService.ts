import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");

export const saveAds = async (pageId: string, ads: any[]) => {
  const dir = path.join(DATA_DIR, pageId);
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, "ads.json");
  await fs.writeFile(file + ".tmp", JSON.stringify(ads, null));
  await fs.rename(file + ".tmp", file);
};

export const loadAds = async (pageId: string) => {
  const file = path.join(DATA_DIR, pageId, "ads.json");
  try {
    const content = await fs.readFile(file, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

export const saveMeta = async (pageId: string, meta: any) => {
  const file = path.join(DATA_DIR, pageId, "meta.json");
  await fs.writeFile(file, JSON.stringify(meta, null, 2));
};

export const loadMeta = async (pageId: string) => {
  const file = path.join(DATA_DIR, pageId, "meta.json");
  try {
  } catch (err) {
    return {};
  }
};
