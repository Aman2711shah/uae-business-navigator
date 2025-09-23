import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 sm:p-6 bg-white border-b border-border">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">Welcome to WAZEET</h1>
        <p className="text-xs sm:text-sm text-muted-foreground truncate">Your complete business setup partner</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Button variant="ghost" size="icon" className="relative h-10 w-10 sm:h-12 sm:w-12">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <div className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-brand-orange rounded-full"></div>
        </Button>
        {user ? (
          <UserMenu />
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;