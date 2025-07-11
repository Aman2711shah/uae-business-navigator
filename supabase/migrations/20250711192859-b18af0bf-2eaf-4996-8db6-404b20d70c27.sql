-- Add comprehensive UAE freezone packages
INSERT INTO public.packages (
  freezone_name, package_name, package_type, max_visas,
  shareholders_allowed, activities_allowed, tenure_years, 
  price_aed, base_cost, per_visa_cost, included_services
) VALUES
-- Abu Dhabi Global Market (ADGM)
('ADGM', 'FZ-LLC Standard Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'License, Registration, 1 Visa Included'),
('ADGM', 'Branch Office Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Branch License, Registration, 1 Visa Included'),

-- twofour54 Abu Dhabi
('twofour54', 'FZ-LLC Media Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Media License, Office Space, 1 Visa Included'),
('twofour54', 'Branch Media Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Media Branch License, Office Space, 1 Visa Included'),

-- Khalifa Industrial Zone Abu Dhabi (KIZAD)
('KIZAD', 'Industrial FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Industrial License, Warehouse Space, 1 Visa Included'),
('KIZAD', 'Industrial Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Industrial Branch License, Warehouse Space, 1 Visa Included'),

-- Abu Dhabi Airport Free Zone (ADAFZ)
('ADAFZ', 'Airport FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Airport License, Logistics Hub Access, 1 Visa Included'),
('ADAFZ', 'Airport Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Airport Branch License, Logistics Hub Access, 1 Visa Included'),

-- Masdar City Free Zone
('Masdar City', 'Clean Energy FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Clean Energy License, Sustainable Office, 1 Visa Included'),
('Masdar City', 'Clean Energy Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Clean Energy Branch License, Sustainable Office, 1 Visa Included'),

-- Khalifa Port Free Trade Zone
('Khalifa Port FTZ', 'Port FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Port License, Maritime Services, 1 Visa Included'),
('Khalifa Port FTZ', 'Port Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Port Branch License, Maritime Services, 1 Visa Included'),

-- Zayed Port Free Zone
('Zayed Port', 'Maritime FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Maritime License, Port Access, 1 Visa Included'),
('Zayed Port', 'Maritime Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Maritime Branch License, Port Access, 1 Visa Included'),

-- Musaffah Port Free Zone
('Musaffah Port', 'Industrial Port FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Industrial Port License, Manufacturing Hub, 1 Visa Included'),
('Musaffah Port', 'Industrial Port Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Industrial Port Branch License, Manufacturing Hub, 1 Visa Included'),

-- Corniche Free Zone
('Corniche FZ', 'Business FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Business License, Prime Location, 1 Visa Included'),
('Corniche FZ', 'Business Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Business Branch License, Prime Location, 1 Visa Included'),

-- Al Sila'a Free Zone
('Al Sila''a FZ', 'Logistics FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Logistics License, Strategic Location, 1 Visa Included'),
('Al Sila''a FZ', 'Logistics Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Logistics Branch License, Strategic Location, 1 Visa Included'),

-- Sharjah Airport International Free Zone (SAIF Zone)
('SAIF Zone', 'Airport FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Airport License, Cargo Hub Access, 1 Visa Included'),
('SAIF Zone', 'Airport Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Airport Branch License, Cargo Hub Access, 1 Visa Included'),

-- Sharjah Research, Technology, and Innovation Park (SRTIP)
('SRTIP', 'Technology FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Technology License, Research Facilities, 1 Visa Included'),
('SRTIP', 'Technology Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Technology Branch License, Research Facilities, 1 Visa Included'),

-- Sharjah Healthcare City (SHCC)
('SHCC', 'Healthcare FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Healthcare License, Medical Facilities, 1 Visa Included'),
('SHCC', 'Healthcare Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Healthcare Branch License, Medical Facilities, 1 Visa Included'),

-- Sharjah Publishing City (SPC)
('SPC', 'Publishing FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Publishing License, Media Hub, 1 Visa Included'),
('SPC', 'Publishing Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Publishing Branch License, Media Hub, 1 Visa Included'),

-- Sharjah Human Resources Development Free Zone (SHRD)
('SHRD', 'HR Development FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'HR License, Training Facilities, 1 Visa Included'),
('SHRD', 'HR Development Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'HR Branch License, Training Facilities, 1 Visa Included'),

-- Al Zahia Free Zone
('Al Zahia FZ', 'Commercial FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Commercial License, Modern Facilities, 1 Visa Included'),
('Al Zahia FZ', 'Commercial Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Commercial Branch License, Modern Facilities, 1 Visa Included'),

-- Sharjah Technology and Innovation Park (STIP)
('STIP', 'Innovation FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Innovation License, Tech Hub, 1 Visa Included'),
('STIP', 'Innovation Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Innovation Branch License, Tech Hub, 1 Visa Included'),

-- Ajman Free Zone (AFZ)
('AFZ', 'Business FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Business License, Cost-Effective Setup, 1 Visa Included'),
('AFZ', 'Business Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Business Branch License, Cost-Effective Setup, 1 Visa Included'),

-- Ajman Media City Free Zone
('Ajman Media City', 'Media FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Media License, Creative Hub, 1 Visa Included'),
('Ajman Media City', 'Media Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Media Branch License, Creative Hub, 1 Visa Included'),

-- Ajman China Mall Free Zone
('Ajman China Mall', 'Trading FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Trading License, China Trade Hub, 1 Visa Included'),
('Ajman China Mall', 'Trading Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Trading Branch License, China Trade Hub, 1 Visa Included'),

-- Fujairah Free Zone (FFZ)
('FFZ', 'Fujairah FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Business License, East Coast Location, 1 Visa Included'),
('FFZ', 'Fujairah Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Business Branch License, East Coast Location, 1 Visa Included'),

-- Fujairah Creative City
('Fujairah Creative City', 'Creative FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Creative License, Cultural Hub, 1 Visa Included'),
('Fujairah Creative City', 'Creative Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Creative Branch License, Cultural Hub, 1 Visa Included'),

-- Fujairah Oil Industry Zone (FOIZ)
('FOIZ', 'Oil Industry FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Oil Industry License, Energy Hub, 1 Visa Included'),
('FOIZ', 'Oil Industry Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Oil Industry Branch License, Energy Hub, 1 Visa Included'),

-- Fujairah Port
('Fujairah Port', 'Port FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Port License, Maritime Gateway, 1 Visa Included'),
('Fujairah Port', 'Port Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Port Branch License, Maritime Gateway, 1 Visa Included'),

-- RAK Free Trade Zone (RAK FTZ)
('RAK FTZ', 'Free Trade FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Free Trade License, Strategic Location, 1 Visa Included'),
('RAK FTZ', 'Free Trade Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Free Trade Branch License, Strategic Location, 1 Visa Included'),

-- RAK Maritime City Free Zone
('RAK Maritime City', 'Maritime FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Maritime License, Marine Hub, 1 Visa Included'),
('RAK Maritime City', 'Maritime Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Maritime Branch License, Marine Hub, 1 Visa Included'),

-- RAK International Corporate Centre (RAK ICC)
('RAK ICC', 'Corporate FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Corporate License, Business Center, 1 Visa Included'),
('RAK ICC', 'Corporate Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Corporate Branch License, Business Center, 1 Visa Included'),

-- RAK Investment Authority (RAKIA) Free Zone
('RAKIA', 'Investment FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Investment License, Industrial Zone, 1 Visa Included'),
('RAKIA', 'Investment Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Investment Branch License, Industrial Zone, 1 Visa Included'),

-- RAK Media City (RAKMC)
('RAKMC', 'Media FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Media License, Creative Hub, 1 Visa Included'),
('RAKMC', 'Media Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Media Branch License, Creative Hub, 1 Visa Included'),

-- Umm Al Quwain Free Trade Zone (UAQFTZ)
('UAQFTZ', 'Free Trade FZ-LLC Package', 'FZ-LLC', 5, 5, 3, 1, 15500, 10000, 3500, 'Free Trade License, Northern Emirates, 1 Visa Included'),
('UAQFTZ', 'Free Trade Branch Package', 'Branch', 5, 5, 3, 1, 13500, 8500, 3200, 'Free Trade Branch License, Northern Emirates, 1 Visa Included');