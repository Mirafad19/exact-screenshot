import { useEffect, useRef, useState } from "react";
import { Camera, Check, FileText, Hand, LogOut, MousePointer2, Plus, Settings2, Upload, Video, X } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/profile";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Workspace — Dumpit" },
    { name: "description", content: "Your private Dumpit transfer workspace." },
    { property: "og:title", content: "Workspace — Dumpit" },
    { property: "og:description", content: "Your private Dumpit transfer workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("there");
  const [mode, setMode] = useState<"grab" | "catch">("grab");
  const [files, setFiles] = useState<File[]>([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let stream: MediaStream | undefined;
    supabase.auth.getUser().then(async ({ data }) => { if (data.user) { setEmail(data.user.email ?? ""); const profile = await getProfile(data.user.id); setName(profile || data.user.user_metadata?.display_name || "there"); } });
    navigator.mediaDevices?.getUserMedia({ video: true }).then((value) => { stream = value; setCameraOn(true); if (videoRef.current) videoRef.current.srcObject = value; }).catch(() => setCameraError(true));
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, []);

  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/" }); }

  return (
    <main className="app-page">
      <AppHeader email={email} onSignOut={signOut} />
      <div className="dashboard-frame page-frame">
        <div className="dashboard-intro"><div><div className="eyebrow"><span className="eyebrow-dot" /> WORKSPACE / READY</div><h1>Good to see you,<br /><span>{name}.</span></h1></div><div className="privacy-pill"><span className="live-dot" /> Local connection only</div></div>
        <TransferStudio mode={mode} setMode={setMode} files={files} setFiles={setFiles} fileInput={fileInput} videoRef={videoRef} cameraOn={cameraOn} cameraError={cameraError} />
        <div className="dashboard-lower"><section className="activity-panel"><div className="panel-heading"><div><span className="panel-kicker">YOUR HISTORY</span><h2>Recent activity</h2></div><span className="empty-count">0 TRANSFERS</span></div><div className="empty-activity"><div className="empty-icon"><MousePointer2 size={19} /></div><h3>No transfers yet</h3><p>Your local handoffs will appear here once history is connected.</p></div></section><aside className="account-panel"><span className="panel-kicker">ACCOUNT</span><div className="account-avatar">{name.charAt(0).toUpperCase()}</div><h3>{name}</h3><p>{email}</p><Button asChild variant="outline" className="account-button"><a href="/account"><Settings2 size={15} /> Manage account</a></Button></aside></div>
      </div>
    </main>
  );
}

function TransferStudio({ mode, setMode, files, setFiles, fileInput, videoRef, cameraOn, cameraError }: { mode: "grab" | "catch"; setMode: (mode: "grab" | "catch") => void; files: File[]; setFiles: (files: File[]) => void; fileInput: React.RefObject<HTMLInputElement | null>; videoRef: React.RefObject<HTMLVideoElement | null>; cameraOn: boolean; cameraError: boolean }) {
  return <section className="studio-panel"><div className="studio-toolbar"><div><span className="panel-kicker">LIVE STUDIO</span><h2>{mode === "grab" ? "Ready to grab" : "Ready to catch"}</h2></div><div className="mode-toggle" role="group" aria-label="Transfer mode"><button className={mode === "grab" ? "active" : ""} onClick={() => setMode("grab")}><MousePointer2 size={14} /> Grab</button><button className={mode === "catch" ? "active" : ""} onClick={() => setMode("catch")}><Hand size={15} /> Catch</button></div></div><div className="studio-content"><div className="camera-stage"><video ref={videoRef} autoPlay muted playsInline className={cameraOn ? "camera-feed" : "camera-feed hidden"} /><div className="camera-fallback"><div className="camera-rings"><span /><span /><span /></div><div className="gesture-orb">{mode === "grab" ? <span className="fist-shape" /> : <Hand size={72} strokeWidth={1} />}</div><div className="gesture-status"><span className="live-dot" /> {cameraError ? "Camera preview unavailable" : mode === "grab" ? "Show a fist to grab" : "Show an open hand to catch"}</div></div><div className="stage-corners" /><div className="stage-label"><Camera size={13} /> CAMERA {cameraOn ? "LIVE" : "STANDBY"}</div></div><div className="staged-files"><div className="staged-heading"><span>STAGED FILES</span><button onClick={() => fileInput.current?.click()} aria-label="Add files"><Plus size={16} /></button></div>{files.length ? files.map((file) => <div className="staged-file" key={`${file.name}-${file.lastModified}`}><FileText size={17} /><span>{file.name}</span><small>{formatSize(file.size)}</small><button onClick={() => setFiles(files.filter((item) => item !== file))} aria-label={`Remove ${file.name}`}><X size={14} /></button></div>) : <button className="file-drop" onClick={() => fileInput.current?.click()}><Upload size={18} /><strong>Add files to stage</strong><span>Images, video, documents</span></button>}<input ref={fileInput} type="file" multiple hidden onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /><div className="stage-tip"><Check size={14} /> Files never leave this device</div></div></div></section>;
}

function formatSize(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }