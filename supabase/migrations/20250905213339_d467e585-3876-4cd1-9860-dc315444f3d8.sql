-- Enable RLS on services and sub_services tables if not already enabled
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for services table (publicly readable)
CREATE POLICY "Services are publicly readable" 
ON public.services FOR SELECT 
USING (true);

-- Create RLS policies for sub_services table (publicly readable)
CREATE POLICY "Sub-services are publicly readable" 
ON public.sub_services FOR SELECT 
USING (true);

-- Allow admins to manage services and sub-services
CREATE POLICY "Admins can manage services" 
ON public.services FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage sub-services" 
ON public.sub_services FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));