import React from "react";
import { Bot, User } from "lucide-react";
import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-xl p-3 text-xs shadow-sm ${
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/80 text-muted-foreground border'
        }`}
      >
        <div className="flex items-start gap-2">
          {message.sender === 'bot' && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />}
          {message.sender === 'user' && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
          <span className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</span>
        </div>
      </div>
    </div>
  );
};