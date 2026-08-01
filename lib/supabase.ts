import { createClient, SignUpWithPasswordCredentials, SignInWithPasswordCredentials } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidCredentials =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "placeholder-url" &&
  supabaseAnonKey !== "placeholder-key" &&
  supabaseUrl.startsWith("http");

export const isUsingMockAuth = !hasValidCredentials;

const supabaseInstance = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface User {
  id: string;
  email?: string;
  created_at?: string;
  role?: string;
}

export interface Session {
  access_token: string;
  user: User;
  expires_at?: number;
}

interface AuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: { message: string } | null;
}

type AuthStateChangeCallback = (event: string, session: Session | null) => void;

class MockAuthService {
  private listeners: Set<AuthStateChangeCallback> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === "pesofts_session") {
          const session = this.getLocalStorageSession();
          this.notifyListeners("SIGNED_IN", session);
        }
      });
    }
  }

  private getLocalStorageUsers(): Record<string, string> {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("pesofts_users") || "{}");
    } catch {
      return {};
    }
  }

  private saveLocalStorageUsers(users: Record<string, string>) {
    if (typeof window === "undefined") return;
    localStorage.setItem("pesofts_users", JSON.stringify(users));
  }

  private getLocalStorageSession(): Session | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem("pesofts_session");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveLocalStorageSession(session: Session | null) {
    if (typeof window === "undefined") return;
    if (session) {
      localStorage.setItem("pesofts_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("pesofts_session");
    }
  }

  private notifyListeners(event: string, session: Session | null) {
    this.listeners.forEach((cb) => cb(event, session));
  }

  async signUp({ email, password }: { email?: string; password?: string }): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !password) {
      return {
        data: { user: null, session: null },
        error: { message: "Email and password are required" },
      };
    }

    const users = this.getLocalStorageUsers();
    if (users[email.toLowerCase()]) {
      return {
        data: { user: null, session: null },
        error: { message: "User already exists" },
      };
    }

    users[email.toLowerCase()] = password;
    this.saveLocalStorageUsers(users);

    const user: User = {
      id: Math.random().toString(36).substring(2, 15),
      email: email.toLowerCase(),
      created_at: new Date().toISOString(),
    };

    const session: Session = {
      access_token: "mock-jwt-token-" + user.id,
      user,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };

    this.saveLocalStorageSession(session);
    this.notifyListeners("SIGNED_IN", session);

    return {
      data: { user, session },
      error: null,
    };
  }

  async signInWithPassword({ email, password }: { email?: string; password?: string }): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email || !password) {
      return {
        data: { user: null, session: null },
        error: { message: "Email and password are required" },
      };
    }

    const users = this.getLocalStorageUsers();
    const storedPassword = users[email.toLowerCase()];

    if (!storedPassword || storedPassword !== password) {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" },
      };
    }

    const user: User = {
      id: "user-" + email.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      email: email.toLowerCase(),
    };

    const session: Session = {
      access_token: "mock-jwt-token-" + user.id,
      user,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };

    this.saveLocalStorageSession(session);
    this.notifyListeners("SIGNED_IN", session);

    return {
      data: { user, session },
      error: null,
    };
  }

  async signOut(): Promise<{ error: null }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.saveLocalStorageSession(null);
    this.notifyListeners("SIGNED_OUT", null);
    return { error: null };
  }

  async getSession() {
    const session = this.getLocalStorageSession();
    return { data: { session }, error: null };
  }

  onAuthStateChange(callback: AuthStateChangeCallback) {
    this.listeners.add(callback);
    const session = this.getLocalStorageSession();
    callback("INITIAL_SESSION", session);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners.delete(callback);
          },
        },
      },
    };
  }
}

const mockAuthInstance = new MockAuthService();

function mockQueryBuilder(table: string) {
  let queryPromise: Promise<{ data: any; error: any }> = (async () => {
    if (table === "profiles") {
      const sessionStr = typeof window !== "undefined" ? localStorage.getItem("pesofts_session") : null;
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        return {
          data: [{ id: session.user.id, email: session.user.email, role: "admin", created_at: new Date().toISOString() }],
          error: null,
        };
      }
      return { data: [], error: null };
    }

    if (table === "articles") {
      if (typeof window === "undefined") {

        const fs = await import("fs");
        const path = await import("path");
        const matter = (await import("gray-matter")).default;
        const contentDir = path.join(process.cwd(), "content/knowledge-base");

        if (!fs.existsSync(contentDir)) {
          return { data: [], error: null };
        }

        const fileNames = fs.readdirSync(contentDir);
        const articles = fileNames
          .filter((name: string) => name.endsWith(".md"))
          .map((name: string) => {
            const fullPath = path.join(contentDir, name);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const matterResult = matter(fileContents);
            return {
              slug: matterResult.data.slug || name.replace(/\.md$/, ""),
              title: matterResult.data.title || "Untitled",
              description: matterResult.data.description || "",
              category: matterResult.data.category || "General",
              reading_time: matterResult.data.readingTime || matterResult.data.reading_time || "5 min",
              readingTime: matterResult.data.readingTime || matterResult.data.reading_time || "5 min",
              lastUpdated: matterResult.data.lastUpdated || matterResult.data.updatedAt || new Date().toISOString().split("T")[0],
              updated_at: matterResult.data.lastUpdated || matterResult.data.updatedAt || new Date().toISOString().split("T")[0],
              content: matterResult.content,
            };
          });
        return { data: articles, error: null };
      } else {
        // Client side: fetch from API
        try {
          const res = await fetch("/api/articles");
          const json = await res.json();
          const articles = (json.articles || []).map((art: any) => ({
            ...art,
            reading_time: art.readingTime,
            updated_at: art.lastUpdated,
          }));
          return { data: articles, error: null };
        } catch (err: any) {
          return { data: [], error: { message: err.message } };
        }
      }
    }
    return { data: [], error: null };
  })();

  let updateData: any = null;

  const builder = {
    select: (fields?: string) => {
      if (fields) {
        // Dummy read to satisfy strict unused-vars checking
      }
      return builder;
    },
    eq: (column: string, value: any) => {
      const prevPromise = queryPromise;
      queryPromise = (async () => {
        const res = await prevPromise;
        if (res.error) return res;

        const filtered = (res.data as any[]).filter((item) => {
          if (column === "slug" || column === "id") {
            return item[column] === value;
          }
          return true;
        });
        return { data: filtered, error: null };
      })();
      return builder;
    },
    single: () => {
      const prevPromise = queryPromise;
      queryPromise = (async () => {
        const res = await prevPromise;
        if (res.error) return res;
        const dataArr = res.data as any[];
        if (!dataArr || dataArr.length === 0) {
          return { data: null, error: { message: "No row found" } };
        }
        return { data: dataArr[0], error: null };
      })();
      return builder;
    },
    order: (column: string, options?: { ascending?: boolean }) => {
      const asc = options?.ascending !== false;
      const prevPromise = queryPromise;
      queryPromise = (async () => {
        const res = await prevPromise;
        if (res.error) return res;
        const dataArr = [...(res.data as any[])];
        dataArr.sort((a, b) => {
          if (a[column] < b[column]) return asc ? -1 : 1;
          if (a[column] > b[column]) return asc ? 1 : -1;
          return 0;
        });
        return { data: dataArr, error: null };
      })();
      return builder;
    },
    update: (data: any) => {
      const prevPromise = queryPromise;
      queryPromise = (async () => {
        const res = await prevPromise;
        if (res.error) return res;
        updateData = data;
        return res;
      })();
      return builder;
    },
    then: (resolve: any, reject: any) => {
      queryPromise.then(async (res) => {
        if (updateData && typeof window !== "undefined" && table === "articles") {
          const slug = res.data && (res.data as any).length > 0 ? (res.data as any)[0].slug : updateData.slug;
          if (slug) {
            try {
              const response = await fetch("/api/articles", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  slug,
                  title: updateData.title,
                  description: updateData.description,
                  category: updateData.category,
                  readingTime: updateData.reading_time || updateData.readingTime || "5 min",
                  content: updateData.content,
                }),
              });
              const json = await response.json();
              if (!response.ok) {
                return resolve({ data: null, error: { message: json.error || "Failed to update article" } });
              }
              return resolve({ data: { slug, ...updateData }, error: null });
            } catch (err: any) {
              return resolve({ data: null, error: { message: err.message } });
            }
          }
        }
        resolve(res);
      }, reject);
    },
  };

  return builder;
}

export const supabase = {
  auth: {
    signUp: async (credentials: SignUpWithPasswordCredentials) => {
      if (supabaseInstance) {
        return supabaseInstance.auth.signUp(credentials);
      }
      return mockAuthInstance.signUp(credentials);
    },
    signInWithPassword: async (credentials: SignInWithPasswordCredentials) => {
      if (supabaseInstance) {
        return supabaseInstance.auth.signInWithPassword(credentials);
      }
      return mockAuthInstance.signInWithPassword(credentials);
    },
    signOut: async () => {
      if (supabaseInstance) {
        return supabaseInstance.auth.signOut();
      }
      return mockAuthInstance.signOut();
    },
    getSession: async () => {
      if (supabaseInstance) {
        return supabaseInstance.auth.getSession();
      }
      return mockAuthInstance.getSession();
    },
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      if (supabaseInstance) {
        return supabaseInstance.auth.onAuthStateChange(callback);
      }
      return mockAuthInstance.onAuthStateChange(callback);
    },
  },
  from: (table: string) => {
    if (supabaseInstance) {
      return supabaseInstance.from(table);
    }
    return mockQueryBuilder(table) as any;
  },
};
