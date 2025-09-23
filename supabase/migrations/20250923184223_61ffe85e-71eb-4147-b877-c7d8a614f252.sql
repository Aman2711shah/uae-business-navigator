-- Create business_activity_categories table for better organization
CREATE TABLE IF NOT EXISTS public.business_activity_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on business_activity_categories
ALTER TABLE public.business_activity_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for business_activity_categories
DROP POLICY IF EXISTS "Business activity categories are publicly readable" ON public.business_activity_categories;
CREATE POLICY "Business activity categories are publicly readable" 
ON public.business_activity_categories 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins can manage business activity categories" ON public.business_activity_categories;
CREATE POLICY "Admins can manage business activity categories" 
ON public.business_activity_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger for business_activity_categories
DROP TRIGGER IF EXISTS update_business_activity_categories_updated_at ON public.business_activity_categories;
CREATE TRIGGER update_business_activity_categories_updated_at
BEFORE UPDATE ON public.business_activity_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add category reference to business_activities
ALTER TABLE public.business_activities 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.business_activity_categories(id);

-- Insert default categories if they don't exist
INSERT INTO public.business_activity_categories (name, description) 
SELECT * FROM (VALUES
  ('Trading', 'Import, export and general trading activities'),
  ('Food & Beverages', 'Food production, beverages and restaurant services'),
  ('Technology & IT', 'Information technology and software services'),
  ('Consulting Services', 'Professional consulting and advisory services'),
  ('Engineering & Construction', 'Engineering consultancy and construction services'),
  ('Manufacturing', 'Manufacturing and production activities'),
  ('Healthcare & Medical', 'Healthcare services and medical equipment'),
  ('Education & Training', 'Educational services and training programs'),
  ('Media & Entertainment', 'Media production and entertainment services'),
  ('Transportation & Logistics', 'Transportation and logistics services'),
  ('Real Estate & Property', 'Real estate development and property management'),
  ('Hospitality & Tourism', 'Hotel, restaurant and tourism services'),
  ('Textiles & Fashion', 'Textile manufacturing and fashion retail'),
  ('Financial Services', 'Banking, insurance and financial services'),
  ('Oil & Gas', 'Oil, gas and energy sector activities'),
  ('Agriculture', 'Agricultural and farming activities'),
  ('Sports & Recreation', 'Sports facilities and recreational activities'),
  ('Beauty & Personal Care', 'Beauty salon and personal care services'),
  ('Automotive', 'Automotive sales and services'),
  ('Marine & Maritime', 'Marine and maritime services')
) AS v(name, description)
WHERE NOT EXISTS (SELECT 1 FROM public.business_activity_categories WHERE name = v.name);

-- Create package_zone_compatibility table to define which packages work with which zones
CREATE TABLE IF NOT EXISTS public.package_zone_compatibility (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES public.custom_packages(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  price_adjustment NUMERIC DEFAULT 0,
  special_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(package_id, zone_id)
);

-- Enable RLS on package_zone_compatibility
ALTER TABLE public.package_zone_compatibility ENABLE ROW LEVEL SECURITY;

-- Create policies for package_zone_compatibility
DROP POLICY IF EXISTS "Package zone compatibility is publicly readable" ON public.package_zone_compatibility;
CREATE POLICY "Package zone compatibility is publicly readable" 
ON public.package_zone_compatibility 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins can manage package zone compatibility" ON public.package_zone_compatibility;
CREATE POLICY "Admins can manage package zone compatibility" 
ON public.package_zone_compatibility 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update custom_packages table to reference zones if columns don't exist
ALTER TABLE public.custom_packages 
ADD COLUMN IF NOT EXISTS zone_id UUID REFERENCES public.zones(id),
ADD COLUMN IF NOT EXISTS is_mainland BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS setup_timeline_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS min_share_capital NUMERIC DEFAULT 0;

-- Update package_pricing_tiers to have more comprehensive pricing structure
ALTER TABLE public.package_pricing_tiers
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS included_services TEXT[],
ADD COLUMN IF NOT EXISTS excluded_services TEXT[],
ADD COLUMN IF NOT EXISTS additional_fees JSONB DEFAULT '{}';