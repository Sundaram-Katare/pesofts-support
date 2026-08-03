"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        if (data?.user) {
          try {
            await supabase.from("profiles").insert({
              id: data.user.id,
              email: email.toLowerCase(),
              role: "user",
              full_name: email.split("@")[0],
            });
          } catch (profileErr) {
            console.error("Error creating user profile in DB:", profileErr);
          }
        }
        setSuccess(true);
        // Automatically redirect to home page after 2 seconds
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2000);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
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
            Create an account
          </h2>
          <p className="mt-1.5 text-sm text-pesofts-gray-500">
            Sign up to get full access to articles and study guides
          </p>
        </div>

        {error && (
          <div className="bg-pesofts-red-50 border border-pesofts-red-200 text-pesofts-red-700 p-3 rounded-lg flex items-start text-xs leading-5">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-start space-x-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-green-900">Account created!</h4>
              <p className="mt-1 text-xs text-green-700">
                You have signed up successfully. Redirecting you to the platform...
              </p>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
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
                    placeholder="name@company.com"
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
                    autoComplete="new-password"
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
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-pesofts-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-pesofts-red hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
