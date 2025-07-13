import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  responseType?: 'knowledge_base' | 'ai_generated' | 'default';
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "💡 Answer: Hello! I'm your UAE business setup assistant. I can help you with questions about trade licenses, visa requirements, freezone options, and document requirements. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      responseType: 'knowledge_base'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findKnowledgeBaseAnswer = async (userInput: string): Promise<{answer: string, responseType: 'knowledge_base' | 'default'}> => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('answer')
        .ilike('question', `%${userInput}%`)
        .limit(1)
        .single();

      if (error || !data) {
        return {
          answer: "I'm not sure about that. Would you like to speak to a setup expert?",
          responseType: 'default'
        };
      }

      return {
        answer: data.answer,
        responseType: 'knowledge_base'
      };
    } catch (error) {
      console.error('Error fetching knowledge base answer:', error);
      return {
        answer: "I'm not sure about that. Would you like to speak to a setup expert?",
        responseType: 'default'
      };
    }
  };

  const saveChatLog = async (question: string, response: string, responseType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('chat_logs')
        .insert({
          user_id: user?.id || null,
          question,
          response,
          response_type: responseType
        });

      if (error) {
        console.error('Error saving chat log:', error);
      }
    } catch (error) {
      console.error('Error saving chat log:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Find answer from knowledge base
      const { answer, responseType } = await findKnowledgeBaseAnswer(currentInput);
      
      // Format response with prefix
      const formattedResponse = responseType === 'knowledge_base' 
        ? `💡 Answer: ${answer}`
        : answer;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: formattedResponse,
        sender: 'bot',
        timestamp: new Date(),
        responseType
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Save chat log
      await saveChatLog(currentInput, formattedResponse, responseType);
      
    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "I'm experiencing some technical difficulties. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        responseType: 'default'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
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

  return (
    <Card className="fixed bottom-6 right-6 w-80 md:w-96 max-h-[60vh] md:max-h-[90vh] shadow-2xl z-50 flex flex-col rounded-2xl border-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4 flex-shrink-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          Business Setup Assistant
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 hover:bg-muted"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
        <ScrollArea className="flex-1 min-h-0 px-4">
          <div className="space-y-3 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
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
            ))}
            
            {isTyping && (
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
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
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
      </CardContent>
    </Card>
  );
};