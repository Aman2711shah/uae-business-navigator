-- Enable RLS on addon_prices table
ALTER TABLE public.addon_prices ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to addon prices (commonly needed for pricing display)
CREATE POLICY "Addon prices are publicly readable" 
ON public.addon_prices 
FOR SELECT 
USING (true);

-- Create policy for admin management of addon prices
CREATE POLICY "Admins can manage addon prices" 
ON public.addon_prices 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));