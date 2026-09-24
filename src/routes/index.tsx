import { ArrowRight, Check, Hand, MoveRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { DumpitBrand } from "@/components/dumpit-brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dumpit — Grab it. Walk it over. Drop it." },
      { name: "description", content: "Camera-based file transfer between nearby devices. No cables. No cloud upload." },
      { property: "og:title", content: "Dumpit — Grab it. Walk it over. Drop it." },
      { property: "og:description", content: "Camera-based file transfer between nearby devices. No cables. No cloud upload." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="site-nav page-frame" aria-label="Main navigation">
        <DumpitBrand />
        <div className="site-nav-links">
          <a href="#how-it-works">How it works</a>
          <Link to="/auth" className="nav-login">Log in <ArrowRight size={15} /></Link>
        </div>
      </nav>

      <section className="landing-hero page-frame">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> LOCAL DEVICE TRANSFER</div>
          <h1>Grab it.<br /><span>Walk it over.</span><br />Drop it.</h1>
          <p className="hero-lede">Camera-based file transfer between nearby devices. No cables, no cloud upload, just a fist and an open hand.</p>
          <div className="hero-actions">
            <Button asChild size="lg" className="primary-cta"><Link to="/auth">Get started <ArrowRight size={17} /></Link></Button>
            <span className="hero-note">One-off transfers stay account-free.</span>
          </div>
        </div>
        <TransferVisual />
      </section>

      <div className="trust-strip page-frame">
        <div><ShieldCheck size={16} /> PRIVATE BY DESIGN</div>
        <span />
        <div><Zap size={16} /> NEARBY &amp; FAST</div>
        <span />
        <div><Sparkles size={16} /> NOTHING TO INSTALL</div>
      </div>

      <section className="how-section page-frame" id="how-it-works">
        <div className="section-heading">
          <div className="eyebrow">A NEW KIND OF HANDOFF</div>
          <h2>Move files like<br /><em>you mean it.</em></h2>
          <p>Dumpit turns the space between your devices into a transfer lane.</p>
        </div>
        <div className="steps-grid">
          <Step number="01" icon="fist" title="Make a fist" text="Stage your files, then make a fist to grab them." />
          <Step number="02" icon="hand" title="Open your hand" text="Walk to the other device and open your hand." />
          <Step number="03" icon="drop" title="Already there" text="The files land locally. No upload. No waiting." />
        </div>
      </section>

      <section className="statement-section page-frame">
        <div className="statement-line" />
        <p>“The simplest way to get something<br /><span>from here to there.</span>”</p>
        <div className="statement-meta"><span>— DUMPIT / 001</span><span>BUILT FOR THE MOMENT</span></div>
      </section>

      <footer className="site-footer page-frame">
        <DumpitBrand compact />
        <span>Local transfers. Less friction.</span>
        <span className="footer-copy">© 2026 DUMPIT</span>
      </footer>
    </main>
  );
}

function Step({ number, icon, title, text }: { number: string; icon: "fist" | "hand" | "drop"; title: string; text: string }) {
  return (
    <article className="step-card">
      <div className="step-top"><span>{number}</span><MoveRight size={16} /></div>
      <div className={`gesture-icon gesture-${icon}`} aria-hidden="true">
        {icon === "fist" ? <span className="fist-shape" /> : icon === "hand" ? <Hand size={48} strokeWidth={1.2} /> : <span className="drop-shape" />}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function TransferVisual() {
  return (
    <div className="transfer-visual" aria-label="A visual showing a file moving from one device to another">
      <div className="visual-grid" />
      <div className="device device-source"><div className="camera-corner" /><div className="device-label">SOURCE</div><div className="file-chip"><span className="file-type">JPG</span><span>summer.jpg</span></div></div>
      <div className="transfer-path"><span className="path-line" /><div className="path-pulse" /><span className="path-arrow">→</span></div>
      <div className="device device-target"><div className="camera-corner" /><div className="device-label">TARGET</div><div className="hand-outline"><Hand size={76} strokeWidth={0.9} /></div><div className="received-label"><Check size={12} /> RECEIVED</div></div>
      <div className="visual-caption"><span className="live-dot" /> LOCAL LINK <span>•</span> 0.4 SEC</div>
    </div>
  );
}