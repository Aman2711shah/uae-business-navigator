-- Create packages table for freezone cost calculation
CREATE TABLE public.packages (
  id SERIAL PRIMARY KEY,
  freezone_name TEXT NOT NULL,
  package_name TEXT NOT NULL,
  package_type TEXT NOT NULL,
  max_visas INTEGER NOT NULL DEFAULT 0,
  shareholders_allowed INTEGER NOT NULL DEFAULT 1,
  activities_allowed INTEGER NOT NULL DEFAULT 1,
  tenure_years INTEGER NOT NULL DEFAULT 1,
  price_aed DECIMAL(10,2) NOT NULL,
  included_services TEXT,
  per_visa_cost DECIMAL(10,2) DEFAULT 0,
  base_cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Packages are publicly readable" 
ON public.packages 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage packages" 
ON public.packages 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample package data
INSERT INTO public.packages (
  freezone_name, package_name, package_type, max_visas,
  shareholders_allowed, activities_allowed, tenure_years, 
  price_aed, base_cost, per_visa_cost, included_services
) VALUES
('SHAMS', 'Media Package', 'Media', 5, 5, 5, 1, 5750, 5750, 3500, 'License, Lease'),
('SHAMS', 'Standard Package', 'Standard', 5, 5, 5, 1, 6875, 6875, 3500, 'License, Lease'),
('SHAMS', 'Standard License Summer Offer', 'Standard', 5, 5, 5, 1, 12555, 12555, 3500, 'License, Lease, 1 Visa Included'),
('Launch Zone', 'Accelerator E-commerce', 'Starter', 5, 3, 3, 1, 5510, 5510, 3200, 'License, Lease, Upgradable Visas'),
('Launch Zone', 'Professional Package', 'Professional', 5, 5, 5, 1, 8500, 8500, 3200, 'License, Lease, Enhanced Services'),
('Meydan', 'Standard Package', 'Standard', 5, 5, 5, 1, 12500, 12500, 1850, 'License, Lease'),
('Meydan', 'Standard 1 Visa Package', 'Standard', 5, 5, 5, 1, 14350, 12500, 1850, 'License, Lease, Immigration Card, 1 Visa'),
('Meydan', 'Standard 3 Visa Package', 'Standard', 5, 5, 5, 1, 18050, 12500, 1850, 'License, Lease, Immigration Card, 3 Visas'),
('RAKEZ', 'SME Flexi Desk', 'Flexi', 4, 5, 5, 1, 15500, 15500, 4000, 'License, Flexi Desk Access'),
('RAKEZ', 'SME All-In Serviced Office', 'Serviced Office', 5, 5, 5, 1, 27000, 27000, 3500, 'License, Lease, Up to 4 Visas, Upgradeable'),
('RAKEZ', 'Standard Office Package', 'Standard Office', 5, 5, 5, 1, 22000, 22000, 3500, 'License, Office Space');

-- Add trigger for updated_at
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();