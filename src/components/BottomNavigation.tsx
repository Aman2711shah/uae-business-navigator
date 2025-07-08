import { FileText, Users, TrendingUp, MoreHorizontal, Zap } from "lucide-react";

const navItems = [
  { icon: Zap, label: "Home", isActive: true },
  { icon: FileText, label: "Services", isActive: false },
  { icon: Users, label: "Community", isActive: false },
  { icon: TrendingUp, label: "Growth", isActive: false },
  { icon: MoreHorizontal, label: "More", isActive: false },
];

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
              item.isActive
                ? "text-brand-orange bg-brand-orange/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;