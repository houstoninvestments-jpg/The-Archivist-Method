import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, User, LogOut } from "lucide-react";

interface PortalSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

const menuItems = [
  { id: "content", label: "Content", icon: FileText },
  { id: "archivist", label: "Talk to The Archivist AI", icon: MessageSquare },
  { id: "account", label: "Account", icon: User },
];

export default function PortalSidebar({
  activeTab,
  onTabChange,
  onLogout,
}: PortalSidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-sidebar min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="font-bold text-lg">BROKEN PSYCHOLOGY LAB</h2>
        <p className="text-xs text-primary">Member Portal</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => onTabChange(item.id)}
            data-testid={`button-nav-${item.id}`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-muted-foreground"
        onClick={onLogout}
        data-testid="button-logout"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
}
