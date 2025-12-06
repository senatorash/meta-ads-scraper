export interface Ad {
  ad_id: string;
  page_id: string;
  ad_text?: string;
  image_urls?: string[];
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  //   targeting?: any;
  raw: any;
  last_seen?: string;
}

export interface PageMeta {
  page_id: string;
  source_url: string;
  last_synced?: string;
  last_ad_count?: number;
}
