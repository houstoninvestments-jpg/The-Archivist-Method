import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, User, LogOut } from "lucide-react";
import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15__1_-removeb_1765023942955.png";

interface PortalSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  className?: string;
  onNavigate?: () => void;
}

const menuItems = [
  { id: "content", label: "Content", icon: FileText },
  { id: "archivist", label: "The Archivist AI", icon: MessageSquare },
  { id: "account", label: "Account", icon: User },
];

export default function PortalSidebar({
  activeTab,
  onTabChange,
  onLogout,
  className = "",
  onNavigate,
}: PortalSidebarProps) {
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    onNavigate?.();
  };

  return (
    <aside className={`border-r border-border bg-sidebar p-4 flex flex-col ${className}`}>
      <div className="mb-8">
        <img 
          src={logoImage} 
          alt="Broken Psychology Lab" 
          className="h-8 w-auto max-w-full object-contain"
        />
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => handleTabChange(item.id)}
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
