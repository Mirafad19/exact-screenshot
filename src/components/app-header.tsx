import { ArrowLeft, LogOut, Settings2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { DumpitBrand } from "@/components/dumpit-brand";
import { Button } from "@/components/ui/button";

export function AppHeader({ email, onSignOut, backToApp = false }: { email?: string; onSignOut?: () => void; backToApp?: boolean }) {
  return (
    <header className="app-header page-frame">
      <DumpitBrand compact />
      <div className="app-header-actions">
        {email && <span className="header-email">{email}</span>}
        {backToApp ? <Button asChild variant="ghost" size="sm"><Link to="/dashboard"><ArrowLeft size={15} /> Back to app</Link></Button> : <Button asChild variant="ghost" size="icon" aria-label="Account settings"><Link to="/account"><Settings2 size={17} /></Link></Button>}
        {onSignOut && <Button variant="ghost" size="sm" onClick={onSignOut}><LogOut size={15} /> Sign out</Button>}
      </div>
    </header>
  );
}