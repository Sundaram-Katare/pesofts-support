const fs = require("fs");
const path = require("path");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pesofts-support.vercel.app",
  generateRobotsTxt: true,
  exclude: ["/login", "/signup", "/knowledge-base/new"],
  additionalPaths: async (config) => {
    const paths = [];
    const contentDir = path.join(__dirname, "content/knowledge-base");
    
    try {
      if (fs.existsSync(contentDir)) {
        const files = fs.readdirSync(contentDir);
        files.forEach((file) => {
          if (file.endsWith(".md")) {
            const slug = file.replace(/\.md$/, "");
            paths.push({
              loc: `/knowledge-base/${slug}`,
              changefreq: "weekly",
              priority: 0.8,
              lastmod: new Date().toISOString(),
            });
          }
        });
      }
    } catch (err) {
      console.error("Error generating dynamic additional paths for next-sitemap:", err);
    }
    
    return paths;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/signup", "/knowledge-base/new", "/api/"],
      },
    ],
  },
};
