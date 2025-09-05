import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

interface ChatbotWidgetProps {
  onClose?: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    handleSendMessage
  } = useChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  // If used as standalone widget (when onClose is not provided)
  if (!onClose && !isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  // Don't render if used in bottom nav and not opened
  if (onClose && !isOpen) {
    return null;
  }

  return (
    <Card className="fixed bottom-20 right-4 w-80 md:w-96 max-h-[60vh] md:max-h-[70vh] shadow-2xl z-40 flex flex-col rounded-2xl border-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4 flex-shrink-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          Business Setup Assistant
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 hover:bg-muted"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
        <ScrollArea className="flex-1 min-h-0 px-4">
          <div className="space-y-3 pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTyping && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </CardContent>
    </Card>
  );
};