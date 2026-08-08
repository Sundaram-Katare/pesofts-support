import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDocArticleServer, getDocCategoriesServer } from "@/lib/docsServer";
import { markdownToHtml } from "@/lib/markdown";
import { DocPageClient } from "@/components/docs/DocPageClient";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export const revalidate = 0;

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getDocArticleServer(category, slug);

  if (!article) {
    return {
      title: "Document Not Found | PeSofts Documentation",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesofts-support.vercel.app";
  const canonicalUrl = `${siteUrl}/docs/${category}/${slug}`;

  return {
    title: `${article.title} - PeSofts Product Documentation`,
    description: article.description,
    keywords: `${article.categoryName.toLowerCase()}, online exam software, AI proctoring settings, question banks, ${article.title.toLowerCase()}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${article.title} - PeSofts Product Documentation`,
      description: article.description,
      url: canonicalUrl,
      type: "article",
      publishedTime: new Date(article.updatedDate).toISOString(),
      siteName: "PeSofts Product Documentation",
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - PeSofts Product Documentation`,
      description: article.description,
    },
  };
}

// 2. Static Site Generation Paths (Pre-render all pages at compile time)
export async function generateStaticParams() {
  const paths: { category: string; slug: string }[] = [];
  const categories = await getDocCategoriesServer();
  
  categories.forEach((cat) => {
    cat.items.forEach((item) => {
      paths.push({
        category: cat.slug,
        slug: item.slug,
      });
    });
  });

  return paths;
}

function extractHeadings(content: string): { text: string; id: string }[] {
  const headings: { text: string; id: string }[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      const text = line.replace("## ", "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      headings.push({ text, id });
    }
  });

  return headings;
}

export default async function DocArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const article = await getDocArticleServer(category, slug);

  if (!article) {
    notFound();
  }

  // Compile Markdown content to HTML
  const htmlContent = await markdownToHtml(article.content);

  // Extract headings for Table of Contents
  const headings = extractHeadings(article.content);

  const categoriesList = await getDocCategoriesServer();

  // Create JSON-LD schema markup for GEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.description,
    "datePublished": new Date(article.updatedDate).toISOString(),
    "dateModified": new Date(article.updatedDate).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "PeSofts Documentation Team",
      "url": "https://pesofts.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PeSofts",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pesofts.com/images/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pesofts-support.vercel.app/docs/${category}/${slug}`
    },
    "articleSection": article.categoryName,
    "wordCount": article.content.split(/\s+/).length
  };

  return (
    <>
      {/* Schema.org JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Interactive Page Layout Component */}
      <DocPageClient
        article={article}
        htmlContent={htmlContent}
        headings={headings}
        categories={categoriesList}
      />
    </>
  );
}
