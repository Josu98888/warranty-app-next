import type { MetadataRoute } from "next";

// TODO: update with real production URL once the app is deployed to Vercel
const SITE_URL = "https://warranty-app-next.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
