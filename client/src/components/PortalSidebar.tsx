import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, User, LogOut } from "lucide-react";
import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15__1_-removeb_1765023942955.png";

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
        <img 
          src={logoImage} 
          alt="Broken Psychology Lab" 
          className="h-10 w-auto"
        />
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
