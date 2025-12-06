import { useState } from "react";
import { useLocation } from "wouter";
import PortalSidebar from "@/components/PortalSidebar";
import ContentTab from "@/components/ContentTab";
import ChatInterface from "@/components/ChatInterface";
import AccountTab from "@/components/AccountTab";
import LoginPrompt from "@/components/LoginPrompt";

export default function Portal() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("content");
  
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

  return (
    <div className="flex min-h-screen bg-background">
      <PortalSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-hidden">
        {activeTab === "content" && (
          <ContentTab hasCompleteArchive={hasCompleteArchive} />
        )}
        {activeTab === "archivist" && <ChatInterface />}
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
  );
}
