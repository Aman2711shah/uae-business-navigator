import { Building2, Users, Plane, Calendar, FileText, Calculator, CheckCircle } from "lucide-react";
import { BusinessSetupStep, LegalEntityType } from "@/types/businessSetup";

export const businessActivities = {
  "Trading": [
    "General Trading", "Import/Export Trading", "Exporting", "Importing", "Wholesale Trading", "Retail Trading", 
    "E-commerce Trading", "Equipment E-Trading", "Products and Services E-Trading", "Garments, Textiles & Gifts E-Trading",
    "Household, Professional & Personal Goods E-Trading", "Jewellery & Precious Stones E-Trading", "Publications and media Materials E-Trading",
    "Sport & Recreational Events Tickets E-TRADING", "Vehicles E-Trading", "Foodstuff E-Trading", "Trading Crude Oil Abroad",
    "Trading Refined Oil Products Abroad", "Trade Energy Drinks- Wholesale", "Carbon Credit Trading (outside UAE)",
    "Raw Materials Trading", "Basic Industrial Chemicals Trading", "Chemical Related Trading", "Petrochemicals Trading",
    "Industrial Solvents Trading", "Chemical Fertilizers Trading", "Medicinal Chemicals Trading", "Laboratories Chemicals Trading",
    "Oilfield Chemicals Trading", "Water Treatment & Purification Chemicals Trading", "Construction Chemicals Trading",
    "Oil Well Chemicals Trading", "Detergents & Disinfectants Trading", "Para Pharmaceutical Products Trading",
    "Pharmaceutical Trading", "Medical Equipment Trading", "Acids & Alkalines Trading", "Non Edible Oil Trading",
    "Refined Oil Products Trading", "Diesel Fuel Trading", "Lubricants & Grease Trading", "Medical Gas Trading"
  ],
  "Food & Beverages": [
    "Food & Beverages Trading", "Foodstuff & Beverages Trading", "Canned & Preserved Food Trading", "Frozen Fish & Seafood Trading",
    "Fresh, Chilled & Frozen Meat Trading", "Frozen Poultry Trading", "Dairy Products Trading", "Bread & Bakery Products Trading",
    "Coffee Trading", "Tea Trading", "Juice Trading", "Ice Cream Trading", "Health Food Trading", "Baby Food Trading",
    "Confectionery & Chocolate Trading", "Pastry Trading", "Sugar Trading", "Honey & Apiary Accessories Trading",
    "Spices Trading", "Dates Trading", "Nuts Trading", "Ghee & Vegetable Oil Trading", "Grains, Cereals & Legumes Trading",
    "Dried Vegetables & Fruit Trading", "Vegetables & Fruit Trading", "Potatoes Trading", "Flour Trading", "Salt Trading",
    "Salted & Preserved Fish & Seafood Trading", "Fish & Marine Animals Trading", "Egg Trading", "Animal Feed Trading",
    "Animal Fodder Supplements Trading", "Fodder Trading", "Snack Food Trading", "Soft Drinks & Carbonated Water Trading",
    "Mineral Water Trading", "Food Supplements Trading", "Seeds Trading", "Flavours & Fragrances Trading",
    "Beverages Canteen", "Coffee Shop", "Ice-Cream Shop", "Restaurant", "Cafeteria", "Juice & Soft Drinks Preparing",
    "Local Sweets Preparing", "Pastry Preparing", "Baker", "Roastery", "Sandwich Shop"
  ],
  "Technology & IT": [
    "IT Services", "Computer Consultancies", "Computer Systems and Software Designing", "Software House", "Software Trading",
    "Computer & Data Processing Requisites Trading", "Computer Equipment & Requisites Trading", "Computer Electric Accessories Trading",
    "Mobile Phones & Accessories Trading", "Electronic Equipment and Devices Systems and Software Designing",
    "Electronic Chips Designing and Programing", "Electronic Chips Programming", "Telecommunications Equipment Trading",
    "Telephones & Telecommunications Equipment Trading", "Wireless Equipment & Instruments Trading", "Network Consultancies",
    "Network Websites Designing", "Internet Consultancy", "Internet Content Provider", "Internet Marketing",
    "Data Management and Cyber Security Services", "Cyber Security Consultancy", "Information Technology Consultants",
    "Web-Design", "Web-hosting", "Web Analytics", "Computer Graphic Design Consultancy", "Digital Designing",
    "Digital Content Creation", "Digital Media Library, Distribution and Management", "Digital Signage Development and Management",
    "Databases Designing", "Data Collection from One or More Sources", "Data Entry", "Data Preparation", "Data Storing and Recovering",
    "Cloud Service & Datacenters Providers", "Distributed Ledger Technology Services", "Blockchain consultancy",
    "Blockchain software development", "Artificial Intelligence Developer", "Innovation & Artificial Intelligence Research & Consultancies",
    "Mobile App Development", "Web Development", "IT Consulting", "Software Development", "E-commerce Platform"
  ],
  "Consulting Services": [
    "Management Consulting", "Financial Consulting", "HR Consulting", "Legal Consulting", "Marketing Consulting",
    "Business Coaching", "Business Analysis", "Business Plans", "Consulting and research and development in the field of technology education",
    "Consultancy, Studies and Researches in Natural and Engineering Sciences", "Consultancy and Studies and Researches in Economics",
    "Consultancy and Studies and Researches in Linguistics", "Consultancy and Studies and Researches in Literature and Arts",
    "Consultancy and Studies and Researches in Renewable Energy", "Consultancy and Studies and Researches in Sociology",
    "Administrative Consultancy and Studies", "Educational Consultancy", "E-Educational Consultancy", "Health Consultancy and Planning",
    "Insurance Consultancies", "Investment consultancy", "Marketing Research & Consultancies", "Information Studies & Consultancies",
    "Heritage Consultant", "Tourism & Recreation Consultants", "Hotel Consultants", "Business Events Management",
    "Event Production", "Event management - E-sports", "Social Event Management", "Exhibition Organization and Management",
    "Festival Organization and Management", "Auctions Organization and Management", "Live Theatrical Shows Management and Promotion",
    "Aviation Consultancy", "Maritime Consultancies Services", "Customs Consultant", "Feasibility Studies Consultancies",
    "Cost Control & Risk Management Services", "Project Management Consultancy", "Human Resources Consultancy",
    "Facilities Resources Planning Consultancy", "Quality & Standardization Consultants", "Science & Technology Consultancy",
    "Environmental Consultancy and Studies and Researches", "Environmental Consultants & Studies", "Alternative Power and Researches Consultancy"
  ],
  "Engineering & Construction": [
    "Civil Engineering Consultancy", "Architectural Design Consultancy", "Architectural Designing Engineering and City Planning Consultancy",
    "Mechanical Engineering Consultancies", "Electrical Network & Distribution Engineering Consultancy", "Electronic Engineering Consultancy",
    "Construction Engineering Consultancy", "Building Mechanical Engineering Consultancy", "Buildings Electrical Engineering Consultancy",
    "Marine Projects Engineering Consultancy", "Marine Survey Engineering Consultancy", "Ship Engineering Consultancy",
    "Heavy Duty Machinery Engineering Consultancy", "Manufacturing & Material Engineering Consultancy", "Metal Engineering Consultancy",
    "Plastics Engineering Consultancy", "Chemical Related Consultancy", "Petroleum / Oil Related Consultancy", "Petrochemical Engineering Consultancy",
    "Oil Exploration Engineering Consultancy", "Oil Refining Engineering Consultancy", "Petroleum Refining plants Engineering Consultancy",
    "Power & Automatic Control Engineering Consultancy", "Energy Projects Engineering Consultancy", "Renewable Energy Engineering Consultancy",
    "Fire Safety &Protection Engineering Consultancy", "Noise Control, Vibration & Acoustics Consultancy", "Hydraulic Engineering Consultancy",
    "Railway Development Engineering Consultancy", "Road & Traffic Engineering Consultancy", "Tunnels & Bridges Engineering Consultancy",
    "Urban Planning Engineering Consultancy", "Landscaping Engineering Consultancy", "Surveying Engineering Consultancy",
    "Planning & Photogrammetry Engineering Consultancy", "Hydrographic Engineering Surveying Consultancy", "Geodetic Engineering Surveying Consultancy",
    "Foundations & Soil Mechanics Engineering Consultancy", "Structural Quantity Surveying Consultancy", "Interior Design Engineering Consultancy",
    "Green Buildings Engineering Consultancy", "Buildings Energy Efficiency Consultancy", "Meterology Engineering Consultancy",
    "Physical Engineering Consultancy", "Communication Engineering Consultancy", "Medical Engineering Consultancy",
    "Automobile Engineering Consultancy", "Gas Extraction Engineering Consultancy", "Drilling, Stock & Production Engineering Consultancy",
    "Raw-Materials Composition Engineering Consultancy", "Industrial Production Engineering Consultancy", "Mechanical Power Engineering Consultancy",
    "Power, Oil and Gas Consultancy", "Industrial Installations Inspection Engineering Consultancy", "Mining & Mines Equipment Engineering Consultancy",
    "Mines, Mining & Geological Engineering Consultancy", "Mining, Oil & Water Geological Consultancy", "Geological and Geophysical Consultancy and Studies and Researches",
    "Geophysical, Geochemical & Geomechanical Engineering Consultancy", "Water, Sewage & Irrigation Engineering Consultancy",
    "Oil & Gas Tank's Pipes Construction Engineering Consultancy", "Ports Engineering Consultancies", "Civil and Architectural Engineering and Décor Consultancy",
    "Civil Work and Transportation Consultancy", "Ports & Marine Guide Equipment Trading", "Archeological Restoration & Conservation Engineering Consultancy",
    "Engineering Consultancy in tectonic monitoring and earth faults", "Projects Management Engineering&Technical Feasibility Studies Consultancy",
    "Architectural Prospective Drawings Consultancy", "Vertical & Horizontal Transportation Systems Consultant", "Technical Installations Consultancies",
    "Interior Design Consultancy Services", "Interior Design Engineering Services", "Turnkey Projects Contracting"
  ],
  "Manufacturing": [
    "Manufacturing - Electronics", "Manufacturing - Textiles", "Manufacturing - Food Processing", "Manufacturing - Plastics",
    "Food Manufacturing", "Textile Manufacturing", "Electronics Manufacturing", "Chemical Manufacturing", "Plastic Manufacturing", 
    "Metal Manufacturing", "Teeth Manufacturing and Compensation Lab", "Compensation Devices Manufacturing Lab"
  ],
  "Healthcare & Medical": [
    "Medical Services", "Dental Services", "Pharmacy", "Drug Store", "Medical Equipment", "Health Consulting", "Wellness Services",
    "Medical, Surgical Articles & Requisites Trading", "Medical, Surgical Equipment & Instruments Trading", "Veterinary Equipment & Instruments Trading",
    "Veterinary Medicines Wholesale", "Medical Complex", "Veterinarian Clinic", "Veterinary Research Center", "Life Saving Equipment Trading",
    "Occupational Hygiene & Safety Requisites Trading", "Persons with Special Needs Equipment Trading", "Health Services Enterprises Investment, Institution and Management",
    "Pharmaceutical Representative Office", "Pharmaceutical Studies & Researches", "Chemical and Biological Analysis Lab"
  ],
  "Education & Training": [
    "Training Services", "Educational Consulting", "Language Training", "Professional Development", "Online Education",
    "Education Institute", "Educational Services", "Training & Development", "Education Services", "Arabic Language Institute",
    "Foreign Language Institute", "Language Interpretation", "Educational Aids Trading", "E-Training Institute", "E-Tutoring services",
    "Tutoring services", "University Admission Services", "Examinations & Tests Preparation Center", "E-Examination and Test Preparation Center",
    "Local Handicrafts Training Center", "Architecture & Town Planning Training", "Building & Civil Engineering Training",
    "Computer Science Training", "Computer Skills Training", "Computer Training", "Management & Administration Training",
    "Banking & Finance Training", "Marketing & Advertising Training", "Law Training Services", "Insurance training",
    "Technical and Occupational Skills Training", "Household & Domestic Services Training", "Occupational Safety Training",
    "Radio & TV Training Centre", "Hospitality & Tourism Training Services", "Secretarial & Office Work Training",
    "Sales Training", "Personal Development Training", "Fine Arts Training", "Social & Behavioral Science Training",
    "Professional & Management Development Training", "Mind Abilities Development Center", "Arabic Calligraphy Teaching Institute",
    "Branch Business School", "Branch College", "Branch Community College", "Branch University", "Specialized Professional Institute",
    "Non-Academic Infrastructure Provider", "Education Support Services", "Educators Professional Development",
    "Education Services Enterprises Investment, Institution and Management", "Sports Academy", "Gaming Academy",
    "Visual Arts Training Center", "Performing Arts Training Center", "Music Consultant"
  ],
  "Media & Entertainment": [
    "Media & Marketing Consultancy", "Media Buying and Placement", "Media Content Management and Provider", "Media Hardware Equipment and System Integration",
    "Media Monitoring", "Media Representation", "Media Software Development and System Integration", "Media Web Design and Management",
    "Advertising & Communication Agency", "Public Relations Agency", "Public Relations Management", "Marketing Management",
    "Advertisement Designing & Producing", "Advertising Requisites Trading", "Advertising Researches & Consultancies", "Aerial Advertising Services",
    "Creative Agency", "Creative Design", "Branding and Corporate Identity", "Digital Marketing", "Advertising Agency", "Media Production",
    "Content Rights Management", "Content sale and distribution", "Corporate Content Provider", "Corporate Publishing", "Publishing Services",
    "Publishing Consultancy", "Publishing Digitalization", "Publishing Representatives", "Online Publishing and Electronic Content and e‑Books",
    "Magazines", "Newspapers (Regional and National)", "Books", "Books, Newspapers & Publications Trading", "Directories, Guides, Manuals and Catalogues",
    "Films & Photography Materials Trading", "Photographic Equipment & Accessories Trading", "Photography Processing Materials Trading",
    "Photographic Processing Equipment Trading", "Radio, T.V. Stations, Cinema & Theatre Equipment Trading", "Broadcasting Consultants",
    "Music Production, Re‑production and Recordings", "Music Publishing / Copyright", "Music Label and Rights Management", "Music Distribution",
    "Music streaming platform", "Film / TV / Radio Music Production", "Video Games", "Game publishing", "Gaming Platform ‚ Console/PC/Mobile",
    "Gaming Engine", "Gaming Studio", "Gaming Production Service Providers", "Gaming Consultancy Services", "Gaming Industry Research Services",
    "Gaming - Localization Services", "Gaming - Talent Management Services", "Gaming Community Management", "Quality Assurance Specialist - Gaming",
    "E-sports Data & Analytics", "E-sports League Operator", "E-sports Online Publication", "E-sports Organization", "E-sports Tournament platform",
    "Player Support Service Providers", "Talent Management", "IP Streaming/Internet Radio", "IP Streaming/Internet TV", "Radio Network-Satellite",
    "Radio Network-Terrestrial", "Radio Station-Satellite", "Radio Station-Terrestrial", "TV Network/Terrestrial", "TV Network Satellite",
    "TV Station-Satellite", "TV Station-Terrestrial", "TV/ Radio ‚ News Bureau", "TV / Radio ‚ Representative Office",
    "TV / Radio ‚ Sales and Marketing", "TV/ Radio ‚ Satellite Operator", "TV/ Radio ‚ Teleport Operator"
  ],
  "Transportation & Logistics": [
    "Logistics & Transportation", "Logistics Consultancy", "Transport Consultancies", "Air Cargo Agent", "Air Cargo Services",
    "Sea Cargo Services", "Freight Broker", "Airlines of Passengers & Cargo Transportation.", "Air Freight & Passengers Charters",
    "Courier (Branch)", "Aircraft & Requisites Leasing", "Aircraft Charter & Equipment Rental", "Airplane Management & Operation",
    "Ship Charter", "Ship Rental Intermediator", "Ships Management and Operation", "Private Airplane Charter", "Helicopter Rental",
    "Helicopters Operation", "Paramotors Operation", "Ships & Boats Trading", "Aircrafts & Helicopters Trading", "Light Aircraft Trading",
    "Racing Cars Trading", "Buses, Trucks Trading", "New Passenger Motor Vehicles Trading", "Used Automobile Trading",
    "Used Automobile Trading for Export", "Motorcycles Trading", "Used Motorcycles Trading", "Trailers Trading", "Used Vehicles Trading",
    "Electric Cars Trading", "Classic Cars Trading", "Bicycles & Spare Parts Trading", "Motorcycles Spare Parts & Accessories Trading",
    "Auto Spare Parts & Components Trading", "Used Auto Spare Parts & Requisites Trading", "Auto Accessories Trading",
    "Tyres & Rims Trading", "Off Road Karts & Spare Parts Trading", "Trikke Scooters Trading", "Auto Washing Equipment Trading",
    "Cars Electricity Repair and Battery Charge", "Airport Ground Services", "Civil Aviation Information Services",
    "Aircraft Classification Services", "Aviation Services Coordination", "Government Tourist Liaison Office", "Regional Liaison Office",
    "International Airline Representative Office", "Representative Office", "Customs Clearance Services", "Documents Clearing Services",
    "Transactions Follow-up Services", "General Warehousing", "Cold Storage", "Chemicals Storage"
  ],
  "Real Estate & Property": [
    "Real Estate Brokerage", "Real Estate Development", "Property Management", "Real Estate Consultancy", "Real Estate Development Construction",
    "Real Estate Enterprises Investment, Development, Institution and Management", "Real Estate Leasing Brokerage", "Real Estate Purchase and Sale Brokerage",
    "Management of Self Owned Properties", "Services management oversight to the Real Estate", "Property management Services",
    "Establishment of Home Owners‚ Associations", "Multi Family Office", "Single Family Office", "Vacation Homes Rental",
    "Hotel Apartments Rental"
  ],
  "Hospitality & Tourism": [
    "Hotel", "Resort", "Economy Hotel", "Five Star Hotel", "Four Star Hotel", "Three Star Hotel", "Two Star Hotel", "One Star Hotel",
    "Floating Hotel", "Floating Restaurant", "Restaurant", "Restaurant & Mini Store", "Restaurants Management", "Guest House",
    "Hotel Management", "Tourist Enterprises Investment, Institution and Management", "Tourist Guiding Services", "Destination Management",
    "Transit Entertainment", "Themed Amusement Park", "Aviation Club", "Basketball Club", "Bowling Hall", "Billiards and Snooker Hall",
    "Skiing Hall", "Catering Services", "Catering Equipment Trading", "Event Ticketing", "Event management - E-sports"
  ],
  "Textiles & Fashion": [
    "Textile Trading", "Readymade Garments Trading", "Ladies' Garments Trading", "Men's Garment Trading", "Babywear Trading",
    "Underwear Trading", "Uniforms Trading", "Sports Wear Trading", "Arabwear Trading", "Shoe Trading", "Slippers & Sandals Trading",
    "Handbags & Leather Products Trading", "Suitcases & Travel Requisites Trading", "Threads & Yarns Trading", "Cotton & Natural Fibers Trading",
    "Wool & Animal Hair Trading", "Tanned Leathers Trading", "Hides Trading", "Curtains & Upholstery Fabrics Trading",
    "Blankets, Towels & Linens Trading", "Sewing & Embroidery Requisites Trading", "Sewing Machines & Spare Parts Trading",
    "Spinning & Weaving Equipment & Spare Parts Trading", "Special Fabrics & Fibers for Construction Trading",
    "Trading all kinds of ready-made curtains - Wholesale", "Upholstery Requisites & Materials Trading", "Cloth Hangers Trading",
    "Fashion and Clothes Designing", "Fashion Designing", "Costume Design"
  ],
  "Agriculture & Environment": [
    "Advanced Agriculture for vegetables and the melons and the roots and the tubers", "Agricultural Enterprises Investment, Institution and Management",
    "Agricultural Equipment & Accessories Trading", "Agricultural Equipment & Machinery Spare Parts Trading", "Agricultural Tools Trading",
    "Agricultural Tractors & Machinery Trading", "Agricultural Research & Consultancy", "Agricultural & Veterinary Pesticides Trading",
    "Animal & Poultry Farms Equipment Trading", "Green Houses & Equipment Trading", "Irrigation Equipment & Requisites Trading",
    "Garden Equipment Trading", "Trees Seedlings, Ornamental Plants & Annual Flowers Trading", "Flowers & Plants Trading",
    "Artificial Flowers & Plants Trading", "Research and development in the field of basic and advanced agriculture",
    "Environmental Consultancy and Studies and Researches", "Environmental Consultants & Studies", "Environmental Engineering Consultancy",
    "Environment Protection Equipment Trading", "Waste Management & Recycling Consultancy", "Garbage & Waste Collection Containers Trading",
    "Waste Paper Trading", "Waste Plastic Trading", "Used Tires Waste Trading", "Fish & Meat Wastes Trading", "Scrap & Metal Waste Trading",
    "Scrap & Metal Waste Wholesale", "Building Demolition and other Constructions and Debris Clearing", "City Cleaning Equipment Trading",
    "Sea Cleaning Equipment Trading", "Pests Management Consultancy", "Pest Control Equipment Trading", "Fishing & Hunting Requisites Trading",
    "Equestrian education, horse riding", "Horse Equestrian Equipment & Requisites Trading", "Saddles & Animals, Birds Training Requisites Trading",
    "Animal Etiquette & Behaviour Consultant", "Exploration services (research and exploration) for groundwater"
  ]
};

export const legalEntityTypes: LegalEntityType[] = [
  { value: "sole", label: "Sole Establishment", description: "Single owner business" },
  { value: "llc", label: "Limited Liability Company (LLC)", description: "Multiple shareholders" },
  { value: "fzc", label: "Free Zone Company (FZC/FZE)", description: "Free zone establishment" },
  { value: "branch", label: "Branch Office", description: "Extension of foreign company" },
  { value: "offshore", label: "Offshore Company", description: "International business" }
];

export const businessSetupSteps: BusinessSetupStep[] = [
  { number: 1, title: "Category", icon: Building2 },
  { number: 2, title: "Services", icon: FileText },
  { number: 3, title: "Shareholders", icon: Users },
  { number: 4, title: "Visas", icon: Plane },
  { number: 5, title: "Tenure", icon: Calendar },
  { number: 6, title: "Entity", icon: Building2 },
  { number: 7, title: "Cost", icon: Calculator }
];