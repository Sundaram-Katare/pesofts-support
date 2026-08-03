"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Fetch role from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const userRole = profile?.role || "user";

        if (loginMode === "admin" && userRole !== "admin") {
          // Log out immediately if the user is not an admin
          await supabase.auth.signOut();
          setError("Access denied. This account does not have administrator privileges.");
          setLoading(false);
          return;
        }
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-pesofts-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-pesofts-gray-200 shadow-sm">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-pesofts-red text-white w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-lg shadow-sm">
              P
            </div>
            <span className="font-bold text-lg text-pesofts-gray-900 tracking-tight">
              PeSofts <span className="text-pesofts-gray-500 font-medium">Knowledge</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-pesofts-gray-900 tracking-tight">
            {loginMode === "admin" ? "Admin Portal" : "Welcome back"}
          </h2>
          <p className="mt-1.5 text-sm text-pesofts-gray-500">
            {loginMode === "admin" ? "Access administration controls & write articles" : "Sign in to access bookmarked articles and resources"}
          </p>
        </div>

        {/* Login Mode Toggle */}
        <div className="flex bg-pesofts-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setLoginMode("user");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
              loginMode === "user"
                ? "bg-white text-pesofts-gray-900 shadow-sm"
                : "text-pesofts-gray-500 hover:text-pesofts-gray-900"
            }`}
          >
            Login as User
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode("admin");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
              loginMode === "admin"
                ? "bg-white text-pesofts-gray-900 shadow-sm"
                : "text-pesofts-gray-500 hover:text-pesofts-gray-900"
            }`}
          >
            Login as Admin
          </button>
        </div>

        {error && (
          <div className="bg-pesofts-red-50 border border-pesofts-red-200 text-pesofts-red-700 p-3 rounded-lg flex items-start text-xs leading-5">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-wider text-pesofts-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-pesofts-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-pesofts-gray-200 rounded-lg placeholder-pesofts-gray-400 text-pesofts-gray-900 focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm transition-all"
                  placeholder={loginMode === "admin" ? "admin@pesofts.com" : "name@company.com"}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-pesofts-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-pesofts-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-pesofts-gray-200 rounded-lg placeholder-pesofts-gray-400 text-pesofts-gray-900 focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full flex items-center justify-center font-bold text-xs !py-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{loginMode === "admin" ? "Sign In as Admin" : "Sign In"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          {loginMode === "user" ? (
            <p className="text-xs text-pesofts-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-pesofts-red hover:underline">
                Create an account
              </Link>
            </p>
          ) : (
            <p className="text-xs text-pesofts-gray-400">
              Admin registration is managed by system database.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
