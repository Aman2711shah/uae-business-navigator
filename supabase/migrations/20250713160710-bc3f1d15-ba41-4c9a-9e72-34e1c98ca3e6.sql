-- Create knowledge_base table for storing Q&A data
CREATE TABLE public.knowledge_base (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_logs table for storing chat history
CREATE TABLE public.chat_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  response_type TEXT DEFAULT 'knowledge_base', -- 'knowledge_base', 'ai_generated', 'default'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for knowledge_base
CREATE POLICY "Knowledge base is publicly readable" 
ON public.knowledge_base 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage knowledge base" 
ON public.knowledge_base 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for chat_logs
CREATE POLICY "Users can view their own chat logs" 
ON public.chat_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat logs" 
ON public.chat_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all chat logs" 
ON public.chat_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for knowledge_base updated_at
CREATE TRIGGER update_knowledge_base_updated_at
BEFORE UPDATE ON public.knowledge_base
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial knowledge base data
INSERT INTO public.knowledge_base (question, answer, category) VALUES
('What is the UAE corporate tax rate?', 'As of June 2023, the UAE imposes a 9% corporate tax on businesses with net profits exceeding AED 375,000 annually. Businesses earning less than that remain exempt.', 'tax'),
('Is VAT applicable in the UAE?', 'Yes, the UAE has a standard VAT rate of 5% on most goods and services. Businesses with annual turnover exceeding AED 375,000 must register for VAT with the Federal Tax Authority (FTA).', 'tax'),
('What is ESR?', 'ESR (Economic Substance Regulation) requires UAE entities conducting specific activities like banking, shipping, or holding companies to demonstrate substantial economic presence in the UAE. Annual ESR reports are mandatory for qualifying activities.', 'tax'),
('Do Freezone companies pay corporate tax?', 'Most Freezone companies that do not earn mainland UAE income remain exempt from corporate tax under qualifying rules. However, if they conduct business in mainland UAE, they may be subject to the 9% corporate tax.', 'tax'),
('Can a Freezone company open a UAE bank account?', 'Yes, Freezone companies can open UAE corporate accounts with banks like Emirates NBD, ADCB, Mashreq, and RAKBank. Required documents include: Trade License, Shareholder Passport Copies, Emirates ID, Company MOA/AOA, and sometimes a business plan. The process typically takes 7-21 business days.', 'banking'),
('What documents are needed for corporate account opening?', 'For corporate account opening, you need: Trade License, Shareholder Passport Copies, Emirates ID (if available), Company MOA or AOA, Tenancy Contract (optional), and Business Plan with Contracts for high-risk sectors.', 'banking'),
('Can a Freezone company rent a physical office in Dubai?', 'Yes, Freezone companies can rent physical offices in Dubai. While Freezones offer Flexi-desks, you can lease private offices if needed. You may need a tenancy contract registered with Ejari for visa purposes.', 'real_estate'),
('What is Ejari?', 'Ejari is Dubai''s system for registering tenancy contracts. It''s mandatory if you''re applying for visas using your office lease, especially for Mainland company setups.', 'real_estate'),
('Can foreigners buy property in the UAE?', 'Foreigners can buy property in designated freehold areas via personal ownership or through UAE-registered entities. Some Freezones like DIFC and ADGM allow property-holding structures.', 'real_estate'),
('How do I start a business in UAE?', 'To start your business setup in the UAE, you''ll need to: 1) Choose between Mainland or Freezone, 2) Select your business activities, 3) Prepare required documents, and 4) Submit your application. Would you like me to explain any of these steps in detail?', 'general'),
('What documents do I need for business setup?', 'For UAE business setup, you typically need: Passport copies, Emirates ID, Business plan, No objection certificate (if employed), Bank statements, and Educational certificates. The exact requirements vary by business type and location.', 'general'),
('Which freezone is best for IT?', 'For IT businesses, popular freezones include: DMCC (Dubai Multi Commodities Centre), DIFC (Dubai International Financial Centre), Abu Dhabi Global Market, and Dubai Internet City. Each offers different benefits like 100% foreign ownership, tax exemptions, and simplified setup processes.', 'general'),
('What are the visa requirements?', 'UAE business visa requirements depend on your business setup. With a mainland company, you can sponsor family visas. Freezone companies offer investor visas and employee visas. The number of visas depends on your license type and capital.', 'general'),
('What are the costs for business setup?', 'Business setup costs vary significantly: Mainland companies typically range from AED 15,000-50,000, while Freezone setups can range from AED 10,000-40,000. This includes licensing fees, visa costs, and government charges.', 'general');