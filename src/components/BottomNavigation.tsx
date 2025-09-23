import { FileText, Users, TrendingUp, MoreHorizontal, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: FileText, label: "Services", path: "/services" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: TrendingUp, label: "Growth", path: "/growth" },
  { icon: MoreHorizontal, label: "More", path: "/more" },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around px-2 sm:px-6 py-2 sm:py-3">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl transition-all duration-300 transform hover:scale-105 touch-target min-w-0 ${
                isActive
                  ? "text-primary bg-primary/15 shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-1 transition-all duration-200 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              <span className={`text-xs font-medium transition-all duration-200 ${isActive ? 'font-semibold' : ''} truncate`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;