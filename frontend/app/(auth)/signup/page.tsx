"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      document.cookie = `access_token=${data.session.access_token}; path=/`;
      router.push("/");
      router.refresh();
    } else {
      setError("Success! Please check your email to confirm your account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center pt-20 px-4">
      <div className="w-full max-w-[480px] flex flex-col animate-fade-up opacity-0">
        <h1 className="text-[50px] md:text-[64px] font-bold text-ink-black tracking-[-0.04em] leading-[1.05] mb-3 text-center">
          Get started.
        </h1>
        <p className="text-[18px] text-stone-gray text-center mb-10 font-medium">
          Create an account to start analyzing.
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-6 bg-pure-white p-8 md:p-10 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-hairline-mist/50">
          {error && (
            <div className={`px-6 py-4 rounded-[20px] text-[15px] font-medium text-center animate-fade-in ${error.includes("Success") ? "bg-fresh-grass/10 text-fresh-grass" : "bg-coral-pop/10 text-coral-pop"}`}>
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-ink-black ml-1" htmlFor="email">Email address</label>
            <input 
              id="email"
              type="email" 
              placeholder="curious@procureiq.com" 
              className="w-full bg-pure-white border border-hairline-mist rounded-[24px] px-6 py-4 text-[16px] text-ink-black outline-none focus:border-ink-black focus:ring-4 focus:ring-ink-black/5 transition-all placeholder:text-stone-gray/60 font-medium shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2.5 mb-2 relative">
            <label className="text-[15px] font-bold text-ink-black ml-1" htmlFor="password">Password</label>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full bg-pure-white border border-hairline-mist rounded-[24px] px-6 py-4 text-[16px] text-ink-black outline-none focus:border-ink-black focus:ring-4 focus:ring-ink-black/5 transition-all placeholder:text-stone-gray/60 font-medium shadow-sm pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-gray hover:text-ink-black transition-colors z-10 p-2 flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-between items-center bg-ink-black hover:bg-ink-black/90 disabled:opacity-50 disabled:cursor-not-allowed text-pure-white rounded-[50px] pl-8 pr-2 py-2 text-[18px] font-bold transition-all group shadow-md active:scale-95"
          >
            {loading ? "Creating..." : "Create Account"}
            <div className="w-12 h-12 rounded-full bg-fresh-grass flex items-center justify-center text-ink-black group-hover:translate-x-1 transition-transform duration-300">
              {loading ? <Loader2 size={20} strokeWidth={2.5} className="animate-spin" /> : <ArrowRight size={20} strokeWidth={2.5} />}
            </div>
          </button>
          
          <div className="text-center mt-2">
            <span className="text-[15px] text-stone-gray font-medium">Already have an account? </span>
            <Link href="/login" className="text-[15px] font-bold text-ink-black hover:text-sky-pop transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
