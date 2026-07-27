import type { MetadataRoute } from "next";

// TODO: update with real production URL once the app is deployed to Vercel
const SITE_URL = "https://warranty-app-next.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/record-product`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/reminders`,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
