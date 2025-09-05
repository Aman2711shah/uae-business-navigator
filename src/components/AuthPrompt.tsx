import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthPromptProps {
  onSignIn: () => void;
}

const AuthPrompt = ({ onSignIn }: AuthPromptProps) => {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-6 text-center">
        <Lock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-orange-800 mb-2">
          Sign In Required
        </h3>
        <p className="text-orange-700 mb-4">
          Please sign in to submit service applications and access your submissions securely.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={onSignIn}>
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Link to="/auth">
            <Button variant="outline">
              Create Account
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthPrompt;