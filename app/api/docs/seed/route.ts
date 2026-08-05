// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// export async function POST(request: Request) {
//   try {
//     const authHeader = request.headers.get("Authorization");
//     const token = authHeader?.split(" ")[1];

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized: Missing authentication token" }, { status: 401 });
//     }

//     const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//     const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//     if (!supabaseUrl || !supabaseAnonKey) {
//       return NextResponse.json({ error: "Missing Supabase credentials in server configuration." }, { status: 500 });
//     }

//     const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
//       auth: {
//         persistSession: false,
//       },
//     });

//     await supabaseServer.auth.setSession({
//       access_token: token,
//       refresh_token: "",
//     });

//     // Verify token & role
//     const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

//     if (authError || !user) {
//       return NextResponse.json({ error: "Unauthorized: Invalid or expired access token" }, { status: 401 });
//     }

//     const { data: profile, error: profileError } = await supabaseServer
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     if (profileError || profile?.role !== "admin") {
//       return NextResponse.json({ error: "Forbidden: Administrator privileges required" }, { status: 403 });
//     }

//     const articles = Object.values(docArticles);
//     let seededCount = 0;

//     for (const article of articles) {
//       const { error: dbError } = await supabaseServer
//         .from("docs")
//         .upsert({
//           slug: article.slug,
//           category_slug: article.categorySlug,
//           category_name: article.categoryName,
//           title: article.title,
//           description: article.description,
//           reading_time: article.readingTime,
//           content: article.content,
//           updated_at: new Date().toISOString(),
//         }, { onConflict: "slug" });

//       if (dbError) {
//         console.error(`Failed to seed ${article.slug}:`, dbError.message);
//       } else {
//         seededCount++;
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: `Successfully seeded ${seededCount} of ${articles.length} static documentation articles into the Supabase database.`,
//     });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
