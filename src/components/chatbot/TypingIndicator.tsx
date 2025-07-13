import React from "react";
import { Bot } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-muted/80 text-muted-foreground rounded-xl p-3 text-xs flex items-center gap-2 border shadow-sm">
        <Bot className="h-3 w-3 text-primary" />
        <span>Typing...</span>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};