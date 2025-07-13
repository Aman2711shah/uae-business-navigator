-- Create saved quotes/drafts table
CREATE TABLE public.saved_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quote_name TEXT NOT NULL DEFAULT 'Untitled Quote',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'completed')),
  selected_activities TEXT[] NOT NULL DEFAULT '{}',
  shareholders INTEGER NOT NULL DEFAULT 1,
  total_visas INTEGER NOT NULL DEFAULT 0,
  tenure INTEGER NOT NULL DEFAULT 1,
  entity_type TEXT,
  estimated_cost NUMERIC DEFAULT 0,
  recommended_package JSONB,
  alternative_packages JSONB DEFAULT '[]',
  cost_breakdown JSONB,
  is_freezone BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on saved_quotes
ALTER TABLE public.saved_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_quotes
CREATE POLICY "Users can view their own quotes" 
ON public.saved_quotes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes" 
ON public.saved_quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes" 
ON public.saved_quotes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes" 
ON public.saved_quotes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can manage all quotes
CREATE POLICY "Admins can manage all quotes" 
ON public.saved_quotes 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create timeline estimates table
CREATE TABLE public.timeline_estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_step TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  freezone_name TEXT,
  estimated_days INTEGER NOT NULL,
  description TEXT,
  is_business_day BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on timeline_estimates (public read)
ALTER TABLE public.timeline_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Timeline estimates are publicly readable" 
ON public.timeline_estimates 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage timeline estimates" 
ON public.timeline_estimates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample timeline data
INSERT INTO public.timeline_estimates (process_step, entity_type, freezone_name, estimated_days, description) VALUES
('License Application', 'fzc', 'Dubai Internet City', 3, 'Submit and process trade license application'),
('License Application', 'fzc', 'Abu Dhabi Global Market', 5, 'Submit and process trade license application'),
('License Application', 'fzc', 'Sharjah Media City', 4, 'Submit and process trade license application'),
('License Application', 'llc', null, 7, 'Mainland license application and approval'),
('Visa Processing', 'fzc', null, 5, 'Employment visa processing and stamping'),
('Visa Processing', 'llc', null, 7, 'Employment visa processing and stamping'),
('Bank Account Opening', 'fzc', null, 10, 'Corporate bank account setup and approval'),
('Bank Account Opening', 'llc', null, 14, 'Corporate bank account setup and approval'),
('Document Preparation', 'fzc', null, 2, 'Prepare and notarize required documents'),
('Document Preparation', 'llc', null, 3, 'Prepare and notarize required documents');

-- Create trigger for updating updated_at
CREATE TRIGGER update_saved_quotes_updated_at
BEFORE UPDATE ON public.saved_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timeline_estimates_updated_at
BEFORE UPDATE ON public.timeline_estimates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();