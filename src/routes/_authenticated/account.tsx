import { useEffect, useState } from "react";
import { AlertTriangle, Check, Loader2, LogOut, Trash2 } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { deleteAccount } from "@/lib/delete-account.functions";
import { getProfile } from "@/lib/profile";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [
    { title: "Account settings — Dumpit" },
    { name: "description", content: "Manage your Dumpit account settings." },
    { property: "og:title", content: "Account settings — Dumpit" },
    { property: "og:description", content: "Manage your Dumpit account settings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { supabase.auth.getUser().then(async ({ data }) => { if (data.user) { setUserId(data.user.id); setEmail(data.user.email ?? ""); setName(await getProfile(data.user.id) || data.user.user_metadata?.display_name || ""); } }); }, []);
  async function save() { setSaving(true); const { error } = await supabase.from("profiles").update({ display_name: name.trim() }).eq("user_id", userId); if (error) toast.error(error.message); else toast.success("Account updated"); setSaving(false); }
  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/" }); }
  async function removeAccount() { if (!window.confirm("Delete your Dumpit account? This cannot be undone.")) return; setSaving(true); try { await deleteAccount(); await supabase.auth.signOut(); navigate({ to: "/" }); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not delete your account."); setSaving(false); } }
  return <main className="app-page"><AppHeader email={email} onSignOut={signOut} backToApp /><div className="settings-frame page-frame"><div className="settings-intro"><div className="eyebrow"><span className="eyebrow-dot" /> SETTINGS</div><h1>Your account.</h1><p>Keep your workspace details current. Your files remain local.</p></div><div className="settings-columns"><section className="settings-section"><div className="settings-section-heading"><h2>Profile</h2><p>How you appear in your Dumpit workspace.</p></div><div className="settings-form"><label>Display name<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label><label>Email address<Input value={email} readOnly /></label><Button onClick={save} disabled={saving || !name.trim()}>{saving ? <Loader2 className="spin" size={15} /> : <Check size={15} />} Save changes</Button></div></section><section className="settings-section danger-zone"><div className="settings-section-heading"><h2>Session</h2><p>Sign out on this device.</p></div><Button variant="outline" onClick={signOut}><LogOut size={15} /> Sign out</Button><div className="delete-area"><div><h3>Delete account</h3><p>Remove your workspace and account permanently.</p></div><Button variant="outline" onClick={removeAccount} disabled={saving}><Trash2 size={15} /> Delete</Button></div></section></div><div className="settings-note"><AlertTriangle size={16} /><span>Dumpit does not upload your files. Your account only keeps your workspace identity and preferences.</span></div></div></main>;
}