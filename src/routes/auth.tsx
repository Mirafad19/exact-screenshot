import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { DumpitBrand } from "@/components/dumpit-brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/lib/profile";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — Dumpit" },
    { name: "description", content: "Sign in to your Dumpit workspace." },
    { property: "og:title", content: "Sign in — Dumpit" },
    { property: "og:description", content: "Sign in to your Dumpit workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/dashboard" }); });
  }, [navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name.trim() } } });
        if (error) throw error;
        if (data.user) await ensureProfile(data.user.id, name.trim());
        if (!data.session) { toast.success("Check your email to confirm your account."); setMode("login"); }
        else navigate({ to: "/dashboard" });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) await ensureProfile(data.user.id, data.user.user_metadata?.display_name ?? "");
        navigate({ to: "/dashboard" });
      }
    } catch (error) { toast.error(error instanceof Error ? error.message : "Something went wrong. Try again."); }
    finally { setBusy(false); }
  }

  async function googleSignIn() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error(result.error.message); setBusy(false); }
  }

  return (
    <main className="auth-page">
      <div className="auth-top page-frame"><DumpitBrand /><Link to="/" className="back-link"><ArrowLeft size={15} /> Back home</Link></div>
      <div className="auth-layout">
        <div className="auth-intro"><div className="eyebrow"><span className="eyebrow-dot" /> YOUR TRANSFER WORKSPACE</div><h1>Move things<br /><em>your way.</em></h1><p>Save your workspace for repeat handoffs. One-off transfers never require an account.</p></div>
        <section className="auth-card">
          <div className="auth-card-heading"><div className="mode-switch"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Log in</button><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Sign up</button></div><h2>{mode === "login" ? "Welcome back" : "Create your workspace"}</h2><p>{mode === "login" ? "Pick up where you left off." : "A home base for your local handoffs."}</p></div>
          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && <label>Display name<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we call you?" required /></label>}
            <label>Email<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
            <label>Password><span className="password-wrap"><Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
            <Button size="lg" type="submit" disabled={busy} className="auth-submit">{busy ? <Loader2 className="spin" size={17} /> : <>{mode === "login" ? "Log in" : "Create account"} <ArrowRight size={16} /></>}</Button>
          </form>
          <div className="auth-divider"><span>OR</span></div>
          <Button variant="outline" size="lg" type="button" onClick={googleSignIn} disabled={busy} className="google-button"><span className="google-g">G</span> Continue with Google</Button>
          <p className="auth-footnote">By continuing, you agree to keep your transfers local.</p>
        </section>
      </div>
    </main>
  );
}