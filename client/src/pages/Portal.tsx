import { useState } from "react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import PortalSidebar from "@/components/PortalSidebar";
import ContentTab from "@/components/ContentTab";
import ChatInterface from "@/components/ChatInterface";
import AccountTab from "@/components/AccountTab";
import LoginPrompt from "@/components/LoginPrompt";

export default function Portal() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("content");
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // todo: remove mock functionality - get from actual auth state
  const isLoggedIn = true;
  const hasCompleteArchive = false;
  const userEmail = "user@example.com";

  const handleLogin = () => {
    // todo: remove mock functionality - implement Replit Auth
    console.log("Logging in with Replit Auth");
  };

  const handleLogout = () => {
    // todo: remove mock functionality - implement logout
    setLocation("/");
  };

  const handleUpgrade = () => {
    // todo: remove mock functionality - redirect to Stripe checkout
    console.log("Upgrading to complete archive");
  };

  if (!isLoggedIn) {
    return <LoginPrompt onLogin={handleLogin} />;
  }

  const sidebarContent = (
    <PortalSidebar
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      className={isMobile ? "w-full h-full" : "w-64 min-h-screen"}
      onNavigate={() => setSheetOpen(false)}
    />
  );

  return (
    <div className="flex min-h-screen bg-background">
      {isMobile ? (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <div className="flex flex-col w-full">
            <header className="flex items-center gap-4 border-b border-border p-3">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <span className="font-semibold text-sm">
                {activeTab === "content" && "Content"}
                {activeTab === "archivist" && "The Archivist AI"}
                {activeTab === "account" && "Account"}
              </span>
            </header>
            <main className="flex-1 overflow-auto">
              {activeTab === "content" && (
                <ContentTab hasCompleteArchive={hasCompleteArchive} />
              )}
              {activeTab === "archivist" && <ChatInterface isMobile={true} />}
              {activeTab === "account" && (
                <AccountTab
                  email={userEmail}
                  hasPatternSession={true}
                  hasCompleteArchive={hasCompleteArchive}
                  onUpgrade={handleUpgrade}
                />
              )}
            </main>
          </div>
          <SheetContent side="left" className="p-0 w-64">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      ) : (
        <>
          {sidebarContent}
          <main className="flex-1 overflow-hidden">
            {activeTab === "content" && (
              <ContentTab hasCompleteArchive={hasCompleteArchive} />
            )}
            {activeTab === "archivist" && <ChatInterface isMobile={false} />}
            {activeTab === "account" && (
              <AccountTab
                email={userEmail}
                hasPatternSession={true}
                hasCompleteArchive={hasCompleteArchive}
                onUpgrade={handleUpgrade}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}
