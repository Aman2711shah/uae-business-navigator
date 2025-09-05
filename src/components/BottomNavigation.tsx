import { FileText, Users, TrendingUp, MoreHorizontal, Zap, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

const navItems = [
  { icon: Zap, label: "Home", path: "/" },
  { icon: FileText, label: "Services", path: "/services" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: TrendingUp, label: "Growth", path: "/growth" },
  { icon: MoreHorizontal, label: "More", path: "/more" },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 ${
              showChatbot
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <MessageCircle className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Chat</span>
          </button>
        </div>
      </nav>
      
      {showChatbot && (
        <ChatbotWidget onClose={() => setShowChatbot(false)} />
      )}
    </>
  );
};

export default BottomNavigation;