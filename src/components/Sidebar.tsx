import { LayoutDashboard, Database, Cpu, Play, Settings, LogOut, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "datasets", label: "Datasets", icon: Database },
    { id: "models", label: "Models", icon: Cpu },
    { id: "playground", label: "Playground", icon: Play },
  ];

  return (
    <aside className="w-[240px] bg-sidebar text-sidebar-foreground flex flex-col border-r border-border">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <BrainCircuit className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-primary">GenAI Suite</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
              activeTab === item.id
                ? "bg-primary/10 text-primary border-l-4 border-primary rounded-l-none"
                : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeTab === item.id ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors cursor-pointer mt-1">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </div>
      </div>
    </aside>
  );
}
