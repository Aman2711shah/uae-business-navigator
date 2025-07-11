import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
        {user ? (
          <UserMenu />
        ) : (
          <Button 
            variant="outline" 
            size="sm"
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