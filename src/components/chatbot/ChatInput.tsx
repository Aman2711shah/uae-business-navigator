import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isTyping
}) => {
  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t p-4 flex-shrink-0">
      <div className="flex gap-2">
        <Input
          placeholder="Ask about business setup..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="text-xs flex-1 rounded-lg"
        />
        <Button 
          size="icon" 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="h-9 w-9 rounded-lg"
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};