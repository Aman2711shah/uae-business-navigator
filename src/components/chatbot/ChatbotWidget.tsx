import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your UAE business setup assistant. I can help you with questions about trade licenses, visa requirements, freezone options, and document requirements. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response (in real implementation, this would call OpenAI API)
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Tax-related queries
    if (input.includes('corporate tax') || input.includes('tax rate')) {
      return "As of June 2023, the UAE imposes a 9% corporate tax on businesses with net profits exceeding AED 375,000 annually. Businesses earning less than that remain exempt.";
    }
    
    if (input.includes('vat') || input.includes('value added tax')) {
      return "Yes, the UAE has a standard VAT rate of 5% on most goods and services. Businesses with annual turnover exceeding AED 375,000 must register for VAT with the Federal Tax Authority (FTA).";
    }
    
    if (input.includes('esr') || input.includes('economic substance')) {
      return "ESR (Economic Substance Regulation) requires UAE entities conducting specific activities like banking, shipping, or holding companies to demonstrate substantial economic presence in the UAE. Annual ESR reports are mandatory for qualifying activities.";
    }
    
    if (input.includes('freezone tax') || input.includes('free zone tax')) {
      return "Most Freezone companies that do not earn mainland UAE income remain exempt from corporate tax under qualifying rules. However, if they conduct business in mainland UAE, they may be subject to the 9% corporate tax.";
    }
    
    // Banking queries
    if (input.includes('bank account') || input.includes('banking') || input.includes('corporate account')) {
      return "Yes, Freezone companies can open UAE corporate accounts with banks like Emirates NBD, ADCB, Mashreq, and RAKBank. Required documents include: Trade License, Shareholder Passport Copies, Emirates ID, Company MOA/AOA, and sometimes a business plan. The process typically takes 7-21 business days.";
    }
    
    if (input.includes('bank documents') || input.includes('account opening documents')) {
      return "For corporate account opening, you need: Trade License, Shareholder Passport Copies, Emirates ID (if available), Company MOA or AOA, Tenancy Contract (optional), and Business Plan with Contracts for high-risk sectors.";
    }
    
    // Real estate queries
    if (input.includes('office space') || input.includes('rent office') || input.includes('physical office')) {
      return "Yes, Freezone companies can rent physical offices in Dubai. While Freezones offer Flexi-desks, you can lease private offices if needed. You may need a tenancy contract registered with Ejari for visa purposes.";
    }
    
    if (input.includes('ejari') || input.includes('tenancy')) {
      return "Ejari is Dubai's system for registering tenancy contracts. It's mandatory if you're applying for visas using your office lease, especially for Mainland company setups.";
    }
    
    if (input.includes('buy property') || input.includes('real estate') || input.includes('property purchase')) {
      return "Foreigners can buy property in designated freehold areas via personal ownership or through UAE-registered entities. Some Freezones like DIFC and ADGM allow property-holding structures.";
    }
    
    // Original queries
    if (input.includes('start') || input.includes('begin')) {
      return "To start your business setup in the UAE, you'll need to: 1) Choose between Mainland or Freezone, 2) Select your business activities, 3) Prepare required documents, and 4) Submit your application. Would you like me to explain any of these steps in detail?";
    }
    
    if (input.includes('document') || input.includes('papers')) {
      return "For UAE business setup, you typically need: Passport copies, Emirates ID, Business plan, No objection certificate (if employed), Bank statements, and Educational certificates. The exact requirements vary by business type and location. What type of business are you planning to start?";
    }
    
    if (input.includes('freezone') || input.includes('free zone')) {
      return "For IT businesses, popular freezones include: DMCC (Dubai Multi Commodities Centre), DIFC (Dubai International Financial Centre), Abu Dhabi Global Market, and Dubai Internet City. Each offers different benefits like 100% foreign ownership, tax exemptions, and simplified setup processes. Would you like details about any specific freezone?";
    }
    
    if (input.includes('visa') || input.includes('residency')) {
      return "UAE business visa requirements depend on your business setup. With a mainland company, you can sponsor family visas. Freezone companies offer investor visas and employee visas. The number of visas depends on your license type and capital. What's your target business size?";
    }
    
    if (input.includes('cost') || input.includes('price') || input.includes('fee')) {
      return "Business setup costs vary significantly: Mainland companies typically range from AED 15,000-50,000, while Freezone setups can range from AED 10,000-40,000. This includes licensing fees, visa costs, and government charges. Would you like a detailed cost breakdown for your specific business type?";
    }
    
    return "I can help you with UAE business setup including: trade licenses, visa requirements, freezone options, document preparation, cost estimates, tax information (corporate tax, VAT, ESR), banking & account opening, and real estate matters. What would you like to know more about?";
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
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          Business Setup Assistant
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-3 space-y-3">
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 text-xs ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-start gap-1">
                    {message.sender === 'bot' && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    <span className="leading-relaxed">{message.content}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg p-2 text-xs flex items-center gap-1">
                  <Bot className="h-3 w-3" />
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
        
        <div className="flex gap-2">
          <Input
            placeholder="Ask about business setup..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="text-xs"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="h-9 w-9"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};