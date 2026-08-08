import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const contentDirectory = path.join(process.cwd(), "content/knowledge-base");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidCredentials =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "placeholder-url" &&
  supabaseAnonKey !== "placeholder-key" &&
  supabaseUrl.startsWith("http");

const isUsingMockAuth = !hasValidCredentials;

export async function GET() {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return NextResponse.json({ articles: [] });
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const articles = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((name) => {
        const fullPath = path.join(contentDirectory, name);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);
        return {
          slug: matterResult.data.slug || name.replace(/\.md$/, ""),
          title: matterResult.data.title || "Untitled",
          description: matterResult.data.description || "",
          category: matterResult.data.category || "General",
          readingTime: matterResult.data.readingTime || matterResult.data.reading_time || "5 min",
          lastUpdated: matterResult.data.lastUpdated || matterResult.data.updatedAt || new Date().toISOString().split("T")[0],
          content: matterResult.content,
        };
      });
    return NextResponse.json({ articles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing authentication token" }, { status: 401 });
    }

    let isAdmin = false;

    if (isUsingMockAuth) {
      // Mock mode validation
      if (token === "mock-jwt-token-user-admin-pesofts-com" || token.includes("admin")) {
        isAdmin = true;
      }
    } else {
      // Real database validation
      const supabaseServer = createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
          persistSession: false,
        },
      });

      // Set the session context to use the client JWT for database actions
      await supabaseServer.auth.setSession({
        access_token: token,
        refresh_token: "",
      });

      const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

      if (!authError && user) {
        const { data: profile, error: profileError } = await supabaseServer
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Profile query error in API route:", profileError);
        }

        if (profile?.role === "admin") {
          isAdmin = true;
        }
      } else if (authError) {
        console.error("Token verification error in API route:", authError);
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Administrator privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { slug, title, description, category, readingTime, content } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const fileName = `${slug}.md`;
    const fullPath = path.join(contentDirectory, fileName);

    // Construct frontmatter and body
    const fileContent = `---
title: ${title}
description: ${description}
category: ${category}
readingTime: ${readingTime}
slug: ${slug}
lastUpdated: ${new Date().toISOString().split("T")[0]}
---

${content}
`;

    // Ensure directory exists and write file
    try {
      if (!fs.existsSync(contentDirectory)) {
        fs.mkdirSync(contentDirectory, { recursive: true });
      }
      fs.writeFileSync(fullPath, fileContent, "utf8");
    } catch (fsError: any) {
      console.warn("Local filesystem write skipped (expected on read-only serverless platforms):", fsError.message);
      if (isUsingMockAuth) {
        throw fsError;
      }
    }

    // Write to database if using real database
    if (!isUsingMockAuth) {
      const supabaseServer = createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
          persistSession: false,
        },
      });

      await supabaseServer.auth.setSession({
        access_token: token,
        refresh_token: "",
      });

      const { error: dbError } = await supabaseServer
        .from("articles")
        .upsert({
          slug,
          title,
          description,
          category,
          reading_time: readingTime,
          content,
          updated_at: new Date().toISOString(),
        }, { onConflict: "slug" });

      if (dbError) {
        console.error("Supabase Database Articles Upsert Error:", dbError);
        return NextResponse.json({ error: `Database save error: ${dbError.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
