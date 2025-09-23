-- Create zones table for mainland and free zones
CREATE TABLE public.zones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  zone_type text NOT NULL CHECK (zone_type IN ('mainland', 'freezone')),
  description text,
  location text,
  key_benefits text[],
  contact_info jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create business activities table with enhanced details
CREATE TABLE public.business_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  activity_code text,
  license_requirements text[],
  minimum_capital numeric,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create custom packages table
CREATE TABLE public.custom_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  zone_id uuid REFERENCES public.zones(id) ON DELETE CASCADE,
  package_type text NOT NULL CHECK (package_type IN ('basic', 'standard', 'premium', 'custom')),
  max_activities integer NOT NULL DEFAULT 1,
  max_shareholders integer NOT NULL DEFAULT 1,
  max_visas integer NOT NULL DEFAULT 0,
  tenure_years integer[] NOT NULL DEFAULT '{1}',
  base_price numeric NOT NULL DEFAULT 0,
  per_activity_price numeric DEFAULT 0,
  per_shareholder_price numeric DEFAULT 0,
  per_visa_price numeric DEFAULT 0,
  included_services text[],
  additional_fees jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create package pricing tiers for dynamic pricing
CREATE TABLE public.package_pricing_tiers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id uuid REFERENCES public.custom_packages(id) ON DELETE CASCADE,
  tier_name text NOT NULL,
  min_activities integer DEFAULT 1,
  max_activities integer DEFAULT 1,
  min_shareholders integer DEFAULT 1,
  max_shareholders integer DEFAULT 1,
  min_visas integer DEFAULT 0,
  max_visas integer DEFAULT 0,
  tenure_years integer NOT NULL,
  tier_price numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Zones are publicly readable" ON public.zones FOR SELECT USING (true);
CREATE POLICY "Business activities are publicly readable" ON public.business_activities FOR SELECT USING (true);
CREATE POLICY "Custom packages are publicly readable" ON public.custom_packages FOR SELECT USING (true);
CREATE POLICY "Package pricing tiers are publicly readable" ON public.package_pricing_tiers FOR SELECT USING (true);

-- Create admin-only policies for management
CREATE POLICY "Admins can manage zones" ON public.zones FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage business activities" ON public.business_activities FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage custom packages" ON public.custom_packages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage package pricing tiers" ON public.package_pricing_tiers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON public.zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_activities_updated_at BEFORE UPDATE ON public.business_activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_custom_packages_updated_at BEFORE UPDATE ON public.custom_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample mainland zones
INSERT INTO public.zones (name, zone_type, description, location) VALUES
('Dubai Mainland', 'mainland', 'Dubai mainland business setup with access to local and international markets', 'Dubai, UAE'),
('Abu Dhabi Mainland', 'mainland', 'Abu Dhabi mainland business setup in the capital emirate', 'Abu Dhabi, UAE'),
('Sharjah Mainland', 'mainland', 'Sharjah mainland business setup with competitive costs', 'Sharjah, UAE'),
('Ajman Mainland', 'mainland', 'Ajman mainland business setup with streamlined processes', 'Ajman, UAE'),
('Fujairah Mainland', 'mainland', 'Fujairah mainland business setup on the east coast', 'Fujairah, UAE'),
('Ras Al Khaimah Mainland', 'mainland', 'RAK mainland business setup with industrial focus', 'Ras Al Khaimah, UAE'),
('Umm Al Quwain Mainland', 'mainland', 'UAQ mainland business setup with cost advantages', 'Umm Al Quwain, UAE');

-- Insert sample free zones (representative set)
INSERT INTO public.zones (name, zone_type, description, location) VALUES
('Dubai International Financial Centre (DIFC)', 'freezone', 'Leading financial hub in the Middle East', 'Dubai, UAE'),
('Dubai Multi Commodities Centre (DMCC)', 'freezone', 'Global hub for commodities trade', 'Dubai, UAE'),
('Dubai Internet City (DIC)', 'freezone', 'Technology and innovation hub', 'Dubai, UAE'),
('Dubai Media City (DMC)', 'freezone', 'Regional hub for media and creative industries', 'Dubai, UAE'),
('Abu Dhabi Global Market (ADGM)', 'freezone', 'International financial center', 'Abu Dhabi, UAE'),
('Sharjah Airport International Free Zone (SAIF)', 'freezone', 'Logistics and trading hub', 'Sharjah, UAE'),
('Ajman Free Zone', 'freezone', 'Business and industrial free zone', 'Ajman, UAE'),
('Fujairah Free Zone', 'freezone', 'Strategic location for international trade', 'Fujairah, UAE'),
('RAK Free Trade Zone', 'freezone', 'Industrial and commercial free zone', 'Ras Al Khaimah, UAE'),
('Creative City Fujairah', 'freezone', 'Media and creative industries hub', 'Fujairah, UAE');

-- Insert sample business activities
INSERT INTO public.business_activities (name, description, category, activity_code) VALUES
('General Trading', 'Import, export and re-export of goods', 'Trading', 'GT001'),
('Information Technology Services', 'Software development, IT consulting, and digital services', 'Technology', 'IT001'),
('Marketing and Advertising', 'Digital marketing, brand management, and advertising services', 'Marketing', 'MA001'),
('Management Consulting', 'Business strategy, operations, and management advisory services', 'Consulting', 'MC001'),
('Real Estate Services', 'Property management, real estate brokerage, and development', 'Real Estate', 'RE001'),
('Financial Services', 'Investment advisory, financial planning, and wealth management', 'Finance', 'FS001'),
('Healthcare Services', 'Medical consulting, healthcare technology, and wellness services', 'Healthcare', 'HS001'),
('Education and Training', 'Educational services, training programs, and e-learning', 'Education', 'ED001'),
('Engineering Services', 'Civil, mechanical, electrical, and consulting engineering', 'Engineering', 'EN001'),
('Logistics and Transportation', 'Freight forwarding, logistics, and transportation services', 'Logistics', 'LT001');