const fs = require("fs");
const path = require("path");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pesofts-support.vercel.app",
  generateRobotsTxt: true,
  exclude: ["/login", "/signup", "/knowledge-base/new"],
  additionalPaths: async (config) => {
    const paths = [];
    
    // 1. Load Knowledge Base articles
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
      console.error("Error generating dynamic additional paths for next-sitemap knowledge-base:", err);
    }
    
    // 2. Load Documentation pages
    const docs = [
      { category: "getting-started", items: ["overview", "signing-in", "your-first-exam", "concepts"] },
      { category: "exam-creation", items: ["creating-exams", "sections-timing", "grading-rules", "publish-flow"] },
      { category: "question-bank", items: ["structure", "importing-questions", "tags-difficulty", "randomization"] },
      { category: "candidate-management", items: ["bulk-import", "groups", "communication", "attendance"] },
      { category: "ai-proctoring", items: ["how-it-works", "settings", "live-proctoring"] },
      { category: "features", items: ["reports-analytics", "user-roles", "multi-language", "scheduling"] },
      { category: "advanced", items: ["integrations", "platform-settings", "troubleshooting", "api-docs"] }
    ];

    try {
      docs.forEach((doc) => {
        doc.items.forEach((item) => {
          paths.push({
            loc: `/docs/${doc.category}/${item}`,
            changefreq: "weekly",
            priority: 0.8,
            lastmod: new Date().toISOString(),
          });
        });
      });
    } catch (err) {
      console.error("Error generating dynamic additional paths for next-sitemap docs:", err);
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
