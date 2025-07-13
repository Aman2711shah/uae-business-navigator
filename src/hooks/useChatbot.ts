import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/components/chatbot/types";

export const useChatbot = () => {
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
  const { toast } = useToast();

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

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    handleSendMessage
  };
};