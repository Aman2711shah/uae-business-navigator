import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-border">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome to GoPRO</h1>
        <p className="text-muted-foreground">Your complete business setup partner</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-brand-orange rounded-full"></div>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;