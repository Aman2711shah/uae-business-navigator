-- Add new table for free zone costs
CREATE TABLE public.freezone_costs (
  id SERIAL PRIMARY KEY,
  no_of_activity INTEGER NOT NULL,
  license_type TEXT NOT NULL,
  minimum_cost NUMERIC NOT NULL,
  base_license_cost NUMERIC NOT NULL,
  visa_cost NUMERIC NOT NULL,
  additional_fee NUMERIC NOT NULL,
  freezone_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.freezone_costs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Freezone costs are publicly readable" 
ON public.freezone_costs 
FOR SELECT 
USING (true);

-- Insert the freezone data
INSERT INTO public.freezone_costs (no_of_activity, license_type, minimum_cost, base_license_cost, visa_cost, additional_fee, freezone_name) VALUES
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Abu Dhabi Global Market (ADGM)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Abu Dhabi Global Market (ADGM)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'twofour54 Abu Dhabi'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'twofour54 Abu Dhabi'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Khalifa Industrial Zone Abu Dhabi (KIZAD)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Khalifa Industrial Zone Abu Dhabi (KIZAD)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Abu Dhabi Airport Free Zone (ADAFZ)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Abu Dhabi Airport Free Zone (ADAFZ)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Masdar City Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Masdar City Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Khalifa Port Free Trade Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Khalifa Port Free Trade Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Zayed Port Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Zayed Port Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Musaffah Port Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Musaffah Port Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Corniche Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Corniche Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Al Sila Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Al Sila Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Sharjah Airport International Free Zone (SAIF Zone)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Sharjah Airport International Free Zone (SAIF Zone)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Sharjah Media City (Shams)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Sharjah Media City (Shams)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Sharjah Research, Technology, and Innovation Park (SRTIP)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Sharjah Research, Technology, and Innovation Park (SRTIP)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Sharjah Healthcare City (SHCC)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Sharjah Healthcare City (SHCC)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Sharjah Publishing City (SPC)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Sharjah Publishing City (SPC)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Sharjah Human Resources Development Free Zone (SHRD)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Sharjah Human Resources Development Free Zone (SHRD)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Al Zahia Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Al Zahia Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Sharjah Technology and Innovation Park (STIP)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Sharjah Technology and Innovation Park (STIP)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Ajman Free Zone (AFZ)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Ajman Free Zone (AFZ)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Ajman Media City Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Ajman Media City Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Ajman China Mall Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Ajman China Mall Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Fujairah Free Zone (FFZ)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Fujairah Free Zone (FFZ)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Fujairah Creative City'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Fujairah Creative City'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Fujairah Oil Industry Zone (FOIZ)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Fujairah Oil Industry Zone (FOIZ)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Fujairah Port'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Fujairah Port'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Ras Al Khaimah Economic Zone (RAKEZ)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Ras Al Khaimah Economic Zone (RAKEZ)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Ras Al Khaimah Free Trade Zone (RAK FTZ)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Ras Al Khaimah Free Trade Zone (RAK FTZ)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'RAK Maritime City Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'RAK Maritime City Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'RAK International Corporate Centre (RAK ICC)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'RAK International Corporate Centre (RAK ICC)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'RAK Investment Authority (RAKIA) Free Zone'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'RAK Investment Authority (RAKIA) Free Zone'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'RAK Media City (RAKMC)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'RAK Media City (RAKMC)'),
(3, 'FZ-LLC', 15500, 10000, 3500, 2000, 'Umm Al Quwain Free Trade Zone (UAQFTZ)'),
(3, 'Branch', 13500, 8500, 3200, 1800, 'Umm Al Quwain Free Trade Zone (UAQFTZ)');