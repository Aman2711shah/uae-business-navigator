import { useState, useEffect } from 'react';
import { BusinessCategory, BusinessService, VisaType, FreezonePackageData } from '@/types/businessSetup';

// Mock data structure - Replace with actual Google Sheets integration
const MOCK_BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'trading',
    name: 'Trading',
    description: 'Import/Export and General Trading',
    services: [
      { id: 'general-trading', name: 'General Trading', category: 'trading', standardPrice: 5000, premiumPrice: 8000, timeline: '7-10 days', description: 'General trading license for various products', documentRequirements: ['Trade License Application', 'Passport Copies'], isRequired: true },
      { id: 'import-export-trading', name: 'Import/Export Trading', category: 'trading', standardPrice: 6000, premiumPrice: 9000, timeline: '10-14 days', description: 'International import and export operations', documentRequirements: ['Import/Export License', 'Chamber of Commerce Certificate'], isRequired: false },
      { id: 'exporting', name: 'Exporting', category: 'trading', standardPrice: 5500, premiumPrice: 8500, timeline: '7-10 days', description: 'Export operations', documentRequirements: ['Export License'], isRequired: false },
      { id: 'importing', name: 'Importing', category: 'trading', standardPrice: 5500, premiumPrice: 8500, timeline: '7-10 days', description: 'Import operations', documentRequirements: ['Import License'], isRequired: false },
      { id: 'wholesale-trading', name: 'Wholesale Trading', category: 'trading', standardPrice: 5200, premiumPrice: 8200, timeline: '7-10 days', description: 'Wholesale trading operations', documentRequirements: ['Wholesale License'], isRequired: false },
      { id: 'retail-trading', name: 'Retail Trading', category: 'trading', standardPrice: 4800, premiumPrice: 7800, timeline: '5-7 days', description: 'Retail trading operations', documentRequirements: ['Retail License'], isRequired: false },
      { id: 'ecommerce-trading', name: 'E-commerce Trading', category: 'trading', standardPrice: 5000, premiumPrice: 8000, timeline: '7-10 days', description: 'Online trading platform', documentRequirements: ['E-commerce License'], isRequired: false },
      { id: 'equipment-etrading', name: 'Equipment E-Trading', category: 'trading', standardPrice: 5300, premiumPrice: 8300, timeline: '7-10 days', description: 'Online equipment trading', documentRequirements: ['Equipment Trading License'], isRequired: false },
      { id: 'products-services-etrading', name: 'Products and Services E-Trading', category: 'trading', standardPrice: 5100, premiumPrice: 8100, timeline: '7-10 days', description: 'Online products and services trading', documentRequirements: ['E-Trading License'], isRequired: false },
      { id: 'garments-textiles-gifts-etrading', name: 'Garments, Textiles & Gifts E-Trading', category: 'trading', standardPrice: 4900, premiumPrice: 7900, timeline: '7-10 days', description: 'Online garments and textiles trading', documentRequirements: ['Textiles Trading License'], isRequired: false },
      { id: 'household-professional-personal-goods-etrading', name: 'Household, Professional & Personal Goods E-Trading', category: 'trading', standardPrice: 4700, premiumPrice: 7700, timeline: '7-10 days', description: 'Online household goods trading', documentRequirements: ['Goods Trading License'], isRequired: false },
      { id: 'jewellery-precious-stones-etrading', name: 'Jewellery & Precious Stones E-Trading', category: 'trading', standardPrice: 6500, premiumPrice: 9500, timeline: '10-14 days', description: 'Online jewelry trading', documentRequirements: ['Precious Stones License'], isRequired: false },
      { id: 'publications-media-materials-etrading', name: 'Publications and media Materials E-Trading', category: 'trading', standardPrice: 4600, premiumPrice: 7600, timeline: '7-10 days', description: 'Online media publications trading', documentRequirements: ['Media Trading License'], isRequired: false },
      { id: 'sport-recreational-events-tickets-etrading', name: 'Sport & Recreational Events Tickets E-TRADING', category: 'trading', standardPrice: 4500, premiumPrice: 7500, timeline: '5-7 days', description: 'Online event tickets trading', documentRequirements: ['Event Tickets License'], isRequired: false },
      { id: 'vehicles-etrading', name: 'Vehicles E-Trading', category: 'trading', standardPrice: 6200, premiumPrice: 9200, timeline: '10-14 days', description: 'Online vehicle trading', documentRequirements: ['Vehicle Trading License'], isRequired: false },
      { id: 'foodstuff-etrading', name: 'Foodstuff E-Trading', category: 'trading', standardPrice: 5400, premiumPrice: 8400, timeline: '7-10 days', description: 'Online food trading', documentRequirements: ['Food Trading License'], isRequired: false },
      { id: 'trading-crude-oil-abroad', name: 'Trading Crude Oil Abroad', category: 'trading', standardPrice: 8000, premiumPrice: 12000, timeline: '14-21 days', description: 'International crude oil trading', documentRequirements: ['Oil Trading License'], isRequired: false },
      { id: 'trading-refined-oil-products-abroad', name: 'Trading Refined Oil Products Abroad', category: 'trading', standardPrice: 7800, premiumPrice: 11800, timeline: '14-21 days', description: 'International refined oil trading', documentRequirements: ['Refined Oil License'], isRequired: false },
      { id: 'trade-energy-drinks-wholesale', name: 'Trade Energy Drinks- Wholesale', category: 'trading', standardPrice: 5600, premiumPrice: 8600, timeline: '7-10 days', description: 'Wholesale energy drinks trading', documentRequirements: ['Beverages License'], isRequired: false },
      { id: 'carbon-credit-trading', name: 'Carbon Credit Trading (outside UAE)', category: 'trading', standardPrice: 7000, premiumPrice: 10000, timeline: '14-21 days', description: 'International carbon credit trading', documentRequirements: ['Carbon Trading License'], isRequired: false },
      { id: 'raw-materials-trading', name: 'Raw Materials Trading', category: 'trading', standardPrice: 6000, premiumPrice: 9000, timeline: '10-14 days', description: 'Raw materials trading', documentRequirements: ['Raw Materials License'], isRequired: false },
      { id: 'basic-industrial-chemicals-trading', name: 'Basic Industrial Chemicals Trading', category: 'trading', standardPrice: 6800, premiumPrice: 9800, timeline: '10-14 days', description: 'Industrial chemicals trading', documentRequirements: ['Chemicals License'], isRequired: false },
      { id: 'chemical-related-trading', name: 'Chemical Related Trading', category: 'trading', standardPrice: 6700, premiumPrice: 9700, timeline: '10-14 days', description: 'Chemical products trading', documentRequirements: ['Chemical Trading License'], isRequired: false },
      { id: 'petrochemicals-trading', name: 'Petrochemicals Trading', category: 'trading', standardPrice: 7200, premiumPrice: 10200, timeline: '14-21 days', description: 'Petrochemical products trading', documentRequirements: ['Petrochemicals License'], isRequired: false },
      { id: 'industrial-solvents-trading', name: 'Industrial Solvents Trading', category: 'trading', standardPrice: 6400, premiumPrice: 9400, timeline: '10-14 days', description: 'Industrial solvents trading', documentRequirements: ['Solvents License'], isRequired: false },
      { id: 'chemical-fertilizers-trading', name: 'Chemical Fertilizers Trading', category: 'trading', standardPrice: 6300, premiumPrice: 9300, timeline: '10-14 days', description: 'Chemical fertilizers trading', documentRequirements: ['Fertilizers License'], isRequired: false },
      { id: 'medicinal-chemicals-trading', name: 'Medicinal Chemicals Trading', category: 'trading', standardPrice: 7500, premiumPrice: 10500, timeline: '14-21 days', description: 'Medicinal chemicals trading', documentRequirements: ['Medical Chemicals License'], isRequired: false },
      { id: 'laboratories-chemicals-trading', name: 'Laboratories Chemicals Trading', category: 'trading', standardPrice: 7100, premiumPrice: 10100, timeline: '10-14 days', description: 'Laboratory chemicals trading', documentRequirements: ['Lab Chemicals License'], isRequired: false },
      { id: 'oilfield-chemicals-trading', name: 'Oilfield Chemicals Trading', category: 'trading', standardPrice: 7300, premiumPrice: 10300, timeline: '14-21 days', description: 'Oilfield chemicals trading', documentRequirements: ['Oilfield Chemicals License'], isRequired: false },
      { id: 'water-treatment-purification-chemicals-trading', name: 'Water Treatment & Purification Chemicals Trading', category: 'trading', standardPrice: 6600, premiumPrice: 9600, timeline: '10-14 days', description: 'Water treatment chemicals trading', documentRequirements: ['Water Treatment License'], isRequired: false },
      { id: 'construction-chemicals-trading', name: 'Construction Chemicals Trading', category: 'trading', standardPrice: 6500, premiumPrice: 9500, timeline: '10-14 days', description: 'Construction chemicals trading', documentRequirements: ['Construction Chemicals License'], isRequired: false },
      { id: 'oil-well-chemicals-trading', name: 'Oil Well Chemicals Trading', category: 'trading', standardPrice: 7400, premiumPrice: 10400, timeline: '14-21 days', description: 'Oil well chemicals trading', documentRequirements: ['Oil Well Chemicals License'], isRequired: false },
      { id: 'detergents-disinfectants-trading', name: 'Detergents & Disinfectants Trading', category: 'trading', standardPrice: 5800, premiumPrice: 8800, timeline: '7-10 days', description: 'Detergents and disinfectants trading', documentRequirements: ['Detergents License'], isRequired: false },
      { id: 'para-pharmaceutical-products-trading', name: 'Para Pharmaceutical Products Trading', category: 'trading', standardPrice: 7600, premiumPrice: 10600, timeline: '14-21 days', description: 'Para pharmaceutical products trading', documentRequirements: ['Para Pharmaceutical License'], isRequired: false },
      { id: 'pharmaceutical-trading', name: 'Pharmaceutical Trading', category: 'trading', standardPrice: 8500, premiumPrice: 12500, timeline: '14-21 days', description: 'Pharmaceutical products trading', documentRequirements: ['Pharmaceutical License'], isRequired: false },
      { id: 'medical-equipment-trading', name: 'Medical Equipment Trading', category: 'trading', standardPrice: 7700, premiumPrice: 10700, timeline: '14-21 days', description: 'Medical equipment trading', documentRequirements: ['Medical Equipment License'], isRequired: false },
      { id: 'acids-alkalines-trading', name: 'Acids & Alkalines Trading', category: 'trading', standardPrice: 6900, premiumPrice: 9900, timeline: '10-14 days', description: 'Acids and alkalines trading', documentRequirements: ['Acids Trading License'], isRequired: false },
      { id: 'non-edible-oil-trading', name: 'Non Edible Oil Trading', category: 'trading', standardPrice: 6100, premiumPrice: 9100, timeline: '10-14 days', description: 'Non-edible oil trading', documentRequirements: ['Non-Edible Oil License'], isRequired: false },
      { id: 'refined-oil-products-trading', name: 'Refined Oil Products Trading', category: 'trading', standardPrice: 7000, premiumPrice: 10000, timeline: '14-21 days', description: 'Refined oil products trading', documentRequirements: ['Refined Oil License'], isRequired: false },
      { id: 'diesel-fuel-trading', name: 'Diesel Fuel Trading', category: 'trading', standardPrice: 6800, premiumPrice: 9800, timeline: '14-21 days', description: 'Diesel fuel trading', documentRequirements: ['Diesel Trading License'], isRequired: false },
      { id: 'lubricants-grease-trading', name: 'Lubricants & Grease Trading', category: 'trading', standardPrice: 6200, premiumPrice: 9200, timeline: '10-14 days', description: 'Lubricants and grease trading', documentRequirements: ['Lubricants License'], isRequired: false },
      { id: 'medical-gas-trading', name: 'Medical Gas Trading', category: 'trading', standardPrice: 7800, premiumPrice: 10800, timeline: '14-21 days', description: 'Medical gas trading', documentRequirements: ['Medical Gas License'], isRequired: false }
    ]
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    description: 'Food and beverage business operations',
    services: [
      { id: 'food-beverages-trading', name: 'Food & Beverages Trading', category: 'food-beverages', standardPrice: 4500, premiumPrice: 7000, timeline: '5-7 days', description: 'Trading in food and beverage products', documentRequirements: ['Health Permit', 'Food Safety Certificate'], isRequired: true },
      { id: 'foodstuff-beverages-trading', name: 'Foodstuff & Beverages Trading', category: 'food-beverages', standardPrice: 4600, premiumPrice: 7100, timeline: '5-7 days', description: 'Foodstuff and beverages trading', documentRequirements: ['Food Trading License'], isRequired: false },
      { id: 'canned-preserved-food-trading', name: 'Canned & Preserved Food Trading', category: 'food-beverages', standardPrice: 4700, premiumPrice: 7200, timeline: '7-10 days', description: 'Canned and preserved food trading', documentRequirements: ['Preserved Food License'], isRequired: false },
      { id: 'frozen-fish-seafood-trading', name: 'Frozen Fish & Seafood Trading', category: 'food-beverages', standardPrice: 5200, premiumPrice: 7700, timeline: '7-10 days', description: 'Frozen fish and seafood trading', documentRequirements: ['Seafood License'], isRequired: false },
      { id: 'fresh-chilled-frozen-meat-trading', name: 'Fresh, Chilled & Frozen Meat Trading', category: 'food-beverages', standardPrice: 5500, premiumPrice: 8000, timeline: '10-14 days', description: 'Fresh and frozen meat trading', documentRequirements: ['Meat Trading License'], isRequired: false },
      { id: 'frozen-poultry-trading', name: 'Frozen Poultry Trading', category: 'food-beverages', standardPrice: 5300, premiumPrice: 7800, timeline: '7-10 days', description: 'Frozen poultry trading', documentRequirements: ['Poultry License'], isRequired: false },
      { id: 'dairy-products-trading', name: 'Dairy Products Trading', category: 'food-beverages', standardPrice: 5000, premiumPrice: 7500, timeline: '7-10 days', description: 'Dairy products trading', documentRequirements: ['Dairy License'], isRequired: false },
      { id: 'bread-bakery-products-trading', name: 'Bread & Bakery Products Trading', category: 'food-beverages', standardPrice: 4400, premiumPrice: 6900, timeline: '5-7 days', description: 'Bread and bakery products trading', documentRequirements: ['Bakery License'], isRequired: false },
      { id: 'coffee-trading', name: 'Coffee Trading', category: 'food-beverages', standardPrice: 4800, premiumPrice: 7300, timeline: '5-7 days', description: 'Coffee trading', documentRequirements: ['Coffee License'], isRequired: false },
      { id: 'tea-trading', name: 'Tea Trading', category: 'food-beverages', standardPrice: 4700, premiumPrice: 7200, timeline: '5-7 days', description: 'Tea trading', documentRequirements: ['Tea License'], isRequired: false },
      { id: 'juice-trading', name: 'Juice Trading', category: 'food-beverages', standardPrice: 4600, premiumPrice: 7100, timeline: '5-7 days', description: 'Juice trading', documentRequirements: ['Juice License'], isRequired: false },
      { id: 'ice-cream-trading', name: 'Ice Cream Trading', category: 'food-beverages', standardPrice: 4800, premiumPrice: 7300, timeline: '7-10 days', description: 'Ice cream trading', documentRequirements: ['Ice Cream License'], isRequired: false },
      { id: 'health-food-trading', name: 'Health Food Trading', category: 'food-beverages', standardPrice: 5100, premiumPrice: 7600, timeline: '7-10 days', description: 'Health food trading', documentRequirements: ['Health Food License'], isRequired: false },
      { id: 'baby-food-trading', name: 'Baby Food Trading', category: 'food-beverages', standardPrice: 5300, premiumPrice: 7800, timeline: '10-14 days', description: 'Baby food trading', documentRequirements: ['Baby Food License'], isRequired: false },
      { id: 'confectionery-chocolate-trading', name: 'Confectionery & Chocolate Trading', category: 'food-beverages', standardPrice: 4900, premiumPrice: 7400, timeline: '7-10 days', description: 'Confectionery and chocolate trading', documentRequirements: ['Confectionery License'], isRequired: false },
      { id: 'pastry-trading', name: 'Pastry Trading', category: 'food-beverages', standardPrice: 4500, premiumPrice: 7000, timeline: '5-7 days', description: 'Pastry trading', documentRequirements: ['Pastry License'], isRequired: false },
      { id: 'sugar-trading', name: 'Sugar Trading', category: 'food-beverages', standardPrice: 5000, premiumPrice: 7500, timeline: '7-10 days', description: 'Sugar trading', documentRequirements: ['Sugar License'], isRequired: false },
      { id: 'honey-apiary-accessories-trading', name: 'Honey & Apiary Accessories Trading', category: 'food-beverages', standardPrice: 4600, premiumPrice: 7100, timeline: '5-7 days', description: 'Honey and apiary accessories trading', documentRequirements: ['Honey License'], isRequired: false },
      { id: 'spices-trading', name: 'Spices Trading', category: 'food-beverages', standardPrice: 4700, premiumPrice: 7200, timeline: '5-7 days', description: 'Spices trading', documentRequirements: ['Spices License'], isRequired: false },
      { id: 'dates-trading', name: 'Dates Trading', category: 'food-beverages', standardPrice: 4400, premiumPrice: 6900, timeline: '5-7 days', description: 'Dates trading', documentRequirements: ['Dates License'], isRequired: false },
      { id: 'nuts-trading', name: 'Nuts Trading', category: 'food-beverages', standardPrice: 4500, premiumPrice: 7000, timeline: '5-7 days', description: 'Nuts trading', documentRequirements: ['Nuts License'], isRequired: false },
      { id: 'ghee-vegetable-oil-trading', name: 'Ghee & Vegetable Oil Trading', category: 'food-beverages', standardPrice: 5200, premiumPrice: 7700, timeline: '7-10 days', description: 'Ghee and vegetable oil trading', documentRequirements: ['Oil License'], isRequired: false },
      { id: 'grains-cereals-legumes-trading', name: 'Grains, Cereals & Legumes Trading', category: 'food-beverages', standardPrice: 4800, premiumPrice: 7300, timeline: '7-10 days', description: 'Grains and cereals trading', documentRequirements: ['Grains License'], isRequired: false },
      { id: 'dried-vegetables-fruit-trading', name: 'Dried Vegetables & Fruit Trading', category: 'food-beverages', standardPrice: 4600, premiumPrice: 7100, timeline: '5-7 days', description: 'Dried vegetables and fruit trading', documentRequirements: ['Dried Food License'], isRequired: false },
      { id: 'vegetables-fruit-trading', name: 'Vegetables & Fruit Trading', category: 'food-beverages', standardPrice: 4500, premiumPrice: 7000, timeline: '5-7 days', description: 'Fresh vegetables and fruit trading', documentRequirements: ['Fresh Produce License'], isRequired: false },
      { id: 'potatoes-trading', name: 'Potatoes Trading', category: 'food-beverages', standardPrice: 4300, premiumPrice: 6800, timeline: '5-7 days', description: 'Potatoes trading', documentRequirements: ['Potatoes License'], isRequired: false },
      { id: 'flour-trading', name: 'Flour Trading', category: 'food-beverages', standardPrice: 4600, premiumPrice: 7100, timeline: '5-7 days', description: 'Flour trading', documentRequirements: ['Flour License'], isRequired: false },
      { id: 'salt-trading', name: 'Salt Trading', category: 'food-beverages', standardPrice: 4200, premiumPrice: 6700, timeline: '5-7 days', description: 'Salt trading', documentRequirements: ['Salt License'], isRequired: false },
      { id: 'salted-preserved-fish-seafood-trading', name: 'Salted & Preserved Fish & Seafood Trading', category: 'food-beverages', standardPrice: 5100, premiumPrice: 7600, timeline: '7-10 days', description: 'Salted and preserved seafood trading', documentRequirements: ['Preserved Seafood License'], isRequired: false },
      { id: 'fish-marine-animals-trading', name: 'Fish & Marine Animals Trading', category: 'food-beverages', standardPrice: 5000, premiumPrice: 7500, timeline: '7-10 days', description: 'Fish and marine animals trading', documentRequirements: ['Marine Animals License'], isRequired: false },
      { id: 'egg-trading', name: 'Egg Trading', category: 'food-beverages', standardPrice: 4400, premiumPrice: 6900, timeline: '5-7 days', description: 'Egg trading', documentRequirements: ['Egg License'], isRequired: false },
      { id: 'animal-feed-trading', name: 'Animal Feed Trading', category: 'food-beverages', standardPrice: 4700, premiumPrice: 7200, timeline: '7-10 days', description: 'Animal feed trading', documentRequirements: ['Animal Feed License'], isRequired: false },
      { id: 'animal-fodder-supplements-trading', name: 'Animal Fodder Supplements Trading', category: 'food-beverages', standardPrice: 4800, premiumPrice: 7300, timeline: '7-10 days', description: 'Animal fodder supplements trading', documentRequirements: ['Fodder Supplements License'], isRequired: false },
      { id: 'fodder-trading', name: 'Fodder Trading', category: 'food-beverages', standardPrice: 4600, premiumPrice: 7100, timeline: '7-10 days', description: 'Fodder trading', documentRequirements: ['Fodder License'], isRequired: false },
      { id: 'snack-food-trading', name: 'Snack Food Trading', category: 'food-beverages', standardPrice: 4700, premiumPrice: 7200, timeline: '5-7 days', description: 'Snack food trading', documentRequirements: ['Snack Food License'], isRequired: false },
      { id: 'soft-drinks-carbonated-water-trading', name: 'Soft Drinks & Carbonated Water Trading', category: 'food-beverages', standardPrice: 4900, premiumPrice: 7400, timeline: '7-10 days', description: 'Soft drinks trading', documentRequirements: ['Beverages License'], isRequired: false },
      { id: 'mineral-water-trading', name: 'Mineral Water Trading', category: 'food-beverages', standardPrice: 4600, premiumPrice: 7100, timeline: '5-7 days', description: 'Mineral water trading', documentRequirements: ['Water License'], isRequired: false },
      { id: 'food-supplements-trading', name: 'Food Supplements Trading', category: 'food-beverages', standardPrice: 5400, premiumPrice: 7900, timeline: '10-14 days', description: 'Food supplements trading', documentRequirements: ['Supplements License'], isRequired: false },
      { id: 'seeds-trading', name: 'Seeds Trading', category: 'food-beverages', standardPrice: 4500, premiumPrice: 7000, timeline: '5-7 days', description: 'Seeds trading', documentRequirements: ['Seeds License'], isRequired: false },
      { id: 'flavours-fragrances-trading', name: 'Flavours & Fragrances Trading', category: 'food-beverages', standardPrice: 5300, premiumPrice: 7800, timeline: '7-10 days', description: 'Flavours and fragrances trading', documentRequirements: ['Flavours License'], isRequired: false },
      { id: 'beverages-canteen', name: 'Beverages Canteen', category: 'food-beverages', standardPrice: 6000, premiumPrice: 9000, timeline: '14-21 days', description: 'Beverages canteen operations', documentRequirements: ['Canteen License'], isRequired: false },
      { id: 'coffee-shop', name: 'Coffee Shop', category: 'food-beverages', standardPrice: 7000, premiumPrice: 10500, timeline: '14-21 days', description: 'Coffee shop operations', documentRequirements: ['Coffee Shop License'], isRequired: false },
      { id: 'ice-cream-shop', name: 'Ice-Cream Shop', category: 'food-beverages', standardPrice: 6500, premiumPrice: 9500, timeline: '14-21 days', description: 'Ice cream shop operations', documentRequirements: ['Ice Cream Shop License'], isRequired: false },
      { id: 'restaurant', name: 'Restaurant', category: 'food-beverages', standardPrice: 8000, premiumPrice: 12000, timeline: '21-30 days', description: 'Restaurant operations', documentRequirements: ['Restaurant License', 'Health Department Approval'], isRequired: false },
      { id: 'cafeteria', name: 'Cafeteria', category: 'food-beverages', standardPrice: 6500, premiumPrice: 9500, timeline: '14-21 days', description: 'Cafeteria operations', documentRequirements: ['Cafeteria License'], isRequired: false },
      { id: 'juice-soft-drinks-preparing', name: 'Juice & Soft Drinks Preparing', category: 'food-beverages', standardPrice: 5500, premiumPrice: 8000, timeline: '10-14 days', description: 'Juice and soft drinks preparation', documentRequirements: ['Beverage Preparation License'], isRequired: false },
      { id: 'local-sweets-preparing', name: 'Local Sweets Preparing', category: 'food-beverages', standardPrice: 5000, premiumPrice: 7500, timeline: '10-14 days', description: 'Local sweets preparation', documentRequirements: ['Sweets Preparation License'], isRequired: false },
      { id: 'pastry-preparing', name: 'Pastry Preparing', category: 'food-beverages', standardPrice: 5200, premiumPrice: 7700, timeline: '10-14 days', description: 'Pastry preparation', documentRequirements: ['Pastry Preparation License'], isRequired: false },
      { id: 'baker', name: 'Baker', category: 'food-beverages', standardPrice: 5500, premiumPrice: 8000, timeline: '10-14 days', description: 'Bakery operations', documentRequirements: ['Bakery License'], isRequired: false },
      { id: 'roastery', name: 'Roastery', category: 'food-beverages', standardPrice: 6000, premiumPrice: 8500, timeline: '14-21 days', description: 'Coffee roastery operations', documentRequirements: ['Roastery License'], isRequired: false },
      { id: 'sandwich-shop', name: 'Sandwich Shop', category: 'food-beverages', standardPrice: 5800, premiumPrice: 8300, timeline: '10-14 days', description: 'Sandwich shop operations', documentRequirements: ['Sandwich Shop License'], isRequired: false }
    ]
  },
  {
    id: 'technology',
    name: 'Technology & IT',
    description: 'Information technology and software services',
    services: [
      { id: 'it-services', name: 'IT Services', category: 'technology', standardPrice: 6000, premiumPrice: 10000, timeline: '7-10 days', description: 'General IT services', documentRequirements: ['IT License', 'Technical Specifications'], isRequired: true },
      { id: 'computer-consultancies', name: 'Computer Consultancies', category: 'technology', standardPrice: 5500, premiumPrice: 9000, timeline: '5-7 days', description: 'Computer consulting services', documentRequirements: ['Computer Consultancy License'], isRequired: false },
      { id: 'computer-systems-software-designing', name: 'Computer Systems and Software Designing', category: 'technology', standardPrice: 6500, premiumPrice: 10500, timeline: '7-10 days', description: 'Computer systems and software design', documentRequirements: ['Software Design License'], isRequired: false },
      { id: 'software-house', name: 'Software House', category: 'technology', standardPrice: 7000, premiumPrice: 11000, timeline: '10-14 days', description: 'Software development company', documentRequirements: ['Software House License'], isRequired: false },
      { id: 'software-trading', name: 'Software Trading', category: 'technology', standardPrice: 5800, premiumPrice: 9300, timeline: '7-10 days', description: 'Software trading and distribution', documentRequirements: ['Software Trading License'], isRequired: false },
      { id: 'computer-data-processing-requisites-trading', name: 'Computer & Data Processing Requisites Trading', category: 'technology', standardPrice: 5600, premiumPrice: 9100, timeline: '7-10 days', description: 'Computer and data processing equipment trading', documentRequirements: ['Computer Trading License'], isRequired: false },
      { id: 'computer-equipment-requisites-trading', name: 'Computer Equipment & Requisites Trading', category: 'technology', standardPrice: 5700, premiumPrice: 9200, timeline: '7-10 days', description: 'Computer equipment trading', documentRequirements: ['Equipment Trading License'], isRequired: false },
      { id: 'computer-electric-accessories-trading', name: 'Computer Electric Accessories Trading', category: 'technology', standardPrice: 5400, premiumPrice: 8900, timeline: '7-10 days', description: 'Computer electric accessories trading', documentRequirements: ['Accessories Trading License'], isRequired: false },
      { id: 'mobile-phones-accessories-trading', name: 'Mobile Phones & Accessories Trading', category: 'technology', standardPrice: 5900, premiumPrice: 9400, timeline: '7-10 days', description: 'Mobile phones and accessories trading', documentRequirements: ['Mobile Trading License'], isRequired: false },
      { id: 'electronic-equipment-devices-systems-software-designing', name: 'Electronic Equipment and Devices Systems and Software Designing', category: 'technology', standardPrice: 6800, premiumPrice: 10800, timeline: '10-14 days', description: 'Electronic equipment and devices design', documentRequirements: ['Electronic Design License'], isRequired: false },
      { id: 'electronic-chips-designing-programming', name: 'Electronic Chips Designing and Programing', category: 'technology', standardPrice: 7500, premiumPrice: 11500, timeline: '14-21 days', description: 'Electronic chips design and programming', documentRequirements: ['Chips Design License'], isRequired: false },
      { id: 'electronic-chips-programming', name: 'Electronic Chips Programming', category: 'technology', standardPrice: 7200, premiumPrice: 11200, timeline: '10-14 days', description: 'Electronic chips programming', documentRequirements: ['Chips Programming License'], isRequired: false },
      { id: 'telecommunications-equipment-trading', name: 'Telecommunications Equipment Trading', category: 'technology', standardPrice: 6200, premiumPrice: 9700, timeline: '10-14 days', description: 'Telecommunications equipment trading', documentRequirements: ['Telecom Equipment License'], isRequired: false },
      { id: 'telephones-telecommunications-equipment-trading', name: 'Telephones & Telecommunications Equipment Trading', category: 'technology', standardPrice: 6100, premiumPrice: 9600, timeline: '10-14 days', description: 'Telephones and telecommunications equipment trading', documentRequirements: ['Telephones Trading License'], isRequired: false },
      { id: 'wireless-equipment-instruments-trading', name: 'Wireless Equipment & Instruments Trading', category: 'technology', standardPrice: 6300, premiumPrice: 9800, timeline: '10-14 days', description: 'Wireless equipment and instruments trading', documentRequirements: ['Wireless Equipment License'], isRequired: false },
      { id: 'network-consultancies', name: 'Network Consultancies', category: 'technology', standardPrice: 5800, premiumPrice: 9300, timeline: '7-10 days', description: 'Network consulting services', documentRequirements: ['Network Consultancy License'], isRequired: false },
      { id: 'network-websites-designing', name: 'Network Websites Designing', category: 'technology', standardPrice: 5500, premiumPrice: 9000, timeline: '7-10 days', description: 'Network and websites design', documentRequirements: ['Web Design License'], isRequired: false },
      { id: 'internet-consultancy', name: 'Internet Consultancy', category: 'technology', standardPrice: 5400, premiumPrice: 8900, timeline: '5-7 days', description: 'Internet consulting services', documentRequirements: ['Internet Consultancy License'], isRequired: false },
      { id: 'internet-content-provider', name: 'Internet Content Provider', category: 'technology', standardPrice: 5600, premiumPrice: 9100, timeline: '7-10 days', description: 'Internet content provider services', documentRequirements: ['Content Provider License'], isRequired: false },
      { id: 'internet-marketing', name: 'Internet Marketing', category: 'technology', standardPrice: 5200, premiumPrice: 8700, timeline: '5-7 days', description: 'Internet marketing services', documentRequirements: ['Digital Marketing License'], isRequired: false },
      { id: 'data-management-cyber-security-services', name: 'Data Management and Cyber Security Services', category: 'technology', standardPrice: 7000, premiumPrice: 11000, timeline: '10-14 days', description: 'Data management and cybersecurity services', documentRequirements: ['Cybersecurity License'], isRequired: false },
      { id: 'cyber-security-consultancy', name: 'Cyber Security Consultancy', category: 'technology', standardPrice: 6800, premiumPrice: 10800, timeline: '7-10 days', description: 'Cybersecurity consulting services', documentRequirements: ['Security Consultancy License'], isRequired: false },
      { id: 'information-technology-consultants', name: 'Information Technology Consultants', category: 'technology', standardPrice: 5900, premiumPrice: 9400, timeline: '7-10 days', description: 'Information technology consulting', documentRequirements: ['IT Consultancy License'], isRequired: false },
      { id: 'web-design', name: 'Web-Design', category: 'technology', standardPrice: 5300, premiumPrice: 8800, timeline: '7-10 days', description: 'Web design services', documentRequirements: ['Web Design License'], isRequired: false },
      { id: 'web-hosting', name: 'Web-hosting', category: 'technology', standardPrice: 5700, premiumPrice: 9200, timeline: '7-10 days', description: 'Web hosting services', documentRequirements: ['Web Hosting License'], isRequired: false },
      { id: 'web-analytics', name: 'Web Analytics', category: 'technology', standardPrice: 5500, premiumPrice: 9000, timeline: '5-7 days', description: 'Web analytics services', documentRequirements: ['Analytics License'], isRequired: false },
      { id: 'computer-graphic-design-consultancy', name: 'Computer Graphic Design Consultancy', category: 'technology', standardPrice: 5400, premiumPrice: 8900, timeline: '7-10 days', description: 'Computer graphic design consulting', documentRequirements: ['Graphic Design License'], isRequired: false },
      { id: 'digital-designing', name: 'Digital Designing', category: 'technology', standardPrice: 5200, premiumPrice: 8700, timeline: '5-7 days', description: 'Digital design services', documentRequirements: ['Digital Design License'], isRequired: false },
      { id: 'digital-content-creation', name: 'Digital Content Creation', category: 'technology', standardPrice: 5600, premiumPrice: 9100, timeline: '7-10 days', description: 'Digital content creation services', documentRequirements: ['Content Creation License'], isRequired: false },
      { id: 'digital-media-library-distribution-management', name: 'Digital Media Library, Distribution and Management', category: 'technology', standardPrice: 6000, premiumPrice: 9500, timeline: '10-14 days', description: 'Digital media library and distribution', documentRequirements: ['Media Distribution License'], isRequired: false },
      { id: 'digital-signage-development-management', name: 'Digital Signage Development and Management', category: 'technology', standardPrice: 5800, premiumPrice: 9300, timeline: '10-14 days', description: 'Digital signage development and management', documentRequirements: ['Digital Signage License'], isRequired: false },
      { id: 'databases-designing', name: 'Databases Designing', category: 'technology', standardPrice: 6200, premiumPrice: 9700, timeline: '10-14 days', description: 'Database design services', documentRequirements: ['Database Design License'], isRequired: false },
      { id: 'data-collection-from-sources', name: 'Data Collection from One or More Sources', category: 'technology', standardPrice: 5400, premiumPrice: 8900, timeline: '7-10 days', description: 'Data collection services', documentRequirements: ['Data Collection License'], isRequired: false },
      { id: 'data-entry', name: 'Data Entry', category: 'technology', standardPrice: 4800, premiumPrice: 8300, timeline: '5-7 days', description: 'Data entry services', documentRequirements: ['Data Entry License'], isRequired: false },
      { id: 'data-preparation', name: 'Data Preparation', category: 'technology', standardPrice: 5000, premiumPrice: 8500, timeline: '7-10 days', description: 'Data preparation services', documentRequirements: ['Data Preparation License'], isRequired: false },
      { id: 'data-storing-recovering', name: 'Data Storing and Recovering', category: 'technology', standardPrice: 5800, premiumPrice: 9300, timeline: '7-10 days', description: 'Data storage and recovery services', documentRequirements: ['Data Storage License'], isRequired: false },
      { id: 'cloud-service-datacenters-providers', name: 'Cloud Service & Datacenters Providers', category: 'technology', standardPrice: 7500, premiumPrice: 11500, timeline: '14-21 days', description: 'Cloud services and datacenter provision', documentRequirements: ['Cloud Service License'], isRequired: false },
      { id: 'distributed-ledger-technology-services', name: 'Distributed Ledger Technology Services', category: 'technology', standardPrice: 7200, premiumPrice: 11200, timeline: '10-14 days', description: 'Distributed ledger technology services', documentRequirements: ['DLT License'], isRequired: false },
      { id: 'blockchain-consultancy', name: 'Blockchain consultancy', category: 'technology', standardPrice: 6800, premiumPrice: 10800, timeline: '10-14 days', description: 'Blockchain consulting services', documentRequirements: ['Blockchain Consultancy License'], isRequired: false },
      { id: 'blockchain-software-development', name: 'Blockchain software development', category: 'technology', standardPrice: 7400, premiumPrice: 11400, timeline: '14-21 days', description: 'Blockchain software development', documentRequirements: ['Blockchain Development License'], isRequired: false },
      { id: 'artificial-intelligence-developer', name: 'Artificial Intelligence Developer', category: 'technology', standardPrice: 7800, premiumPrice: 11800, timeline: '14-21 days', description: 'AI development services', documentRequirements: ['AI Development License'], isRequired: false },
      { id: 'innovation-artificial-intelligence-research-consultancies', name: 'Innovation & Artificial Intelligence Research & Consultancies', category: 'technology', standardPrice: 7600, premiumPrice: 11600, timeline: '14-21 days', description: 'AI research and consulting', documentRequirements: ['AI Research License'], isRequired: false },
      { id: 'mobile-app-development', name: 'Mobile App Development', category: 'technology', standardPrice: 6500, premiumPrice: 10500, timeline: '10-14 days', description: 'Mobile application development', documentRequirements: ['Mobile App License'], isRequired: false },
      { id: 'web-development', name: 'Web Development', category: 'technology', standardPrice: 6000, premiumPrice: 10000, timeline: '7-10 days', description: 'Web development services', documentRequirements: ['Web Development License'], isRequired: false },
      { id: 'it-consulting', name: 'IT Consulting', category: 'technology', standardPrice: 5800, premiumPrice: 9800, timeline: '7-10 days', description: 'IT consulting services', documentRequirements: ['IT Consulting License'], isRequired: false },
      { id: 'software-development', name: 'Software Development', category: 'technology', standardPrice: 6800, premiumPrice: 10800, timeline: '10-14 days', description: 'Custom software development services', documentRequirements: ['Software Development License'], isRequired: false },
      { id: 'ecommerce-platform', name: 'E-commerce Platform', category: 'technology', standardPrice: 6200, premiumPrice: 10200, timeline: '14-21 days', description: 'E-commerce platform development', documentRequirements: ['E-commerce License'], isRequired: false }
    ]
  },
  {
    id: 'consulting',
    name: 'Consulting Services',
    description: 'Professional consulting and advisory services',
    services: [
      { id: 'management-consulting', name: 'Management Consulting', category: 'consulting', standardPrice: 5000, premiumPrice: 8000, timeline: '5-7 days', description: 'Strategic management consulting services', documentRequirements: ['Professional Qualifications', 'Experience Certificates'], isRequired: true },
      { id: 'financial-consulting', name: 'Financial Consulting', category: 'consulting', standardPrice: 5500, premiumPrice: 8500, timeline: '7-10 days', description: 'Financial consulting and advisory', documentRequirements: ['Financial License'], isRequired: false },
      { id: 'hr-consulting', name: 'HR Consulting', category: 'consulting', standardPrice: 4800, premiumPrice: 7800, timeline: '5-7 days', description: 'Human resources consulting', documentRequirements: ['HR Consultancy License'], isRequired: false },
      { id: 'legal-consulting', name: 'Legal Consulting', category: 'consulting', standardPrice: 6000, premiumPrice: 9000, timeline: '7-10 days', description: 'Legal consulting services', documentRequirements: ['Legal License'], isRequired: false },
      { id: 'marketing-consulting', name: 'Marketing Consulting', category: 'consulting', standardPrice: 4900, premiumPrice: 7900, timeline: '5-7 days', description: 'Marketing consulting services', documentRequirements: ['Marketing License'], isRequired: false },
      { id: 'business-coaching', name: 'Business Coaching', category: 'consulting', standardPrice: 4700, premiumPrice: 7700, timeline: '5-7 days', description: 'Business coaching services', documentRequirements: ['Coaching License'], isRequired: false },
      { id: 'business-analysis', name: 'Business Analysis', category: 'consulting', standardPrice: 5200, premiumPrice: 8200, timeline: '7-10 days', description: 'Business analysis services', documentRequirements: ['Analysis License'], isRequired: false },
      { id: 'business-plans', name: 'Business Plans', category: 'consulting', standardPrice: 4600, premiumPrice: 7600, timeline: '5-7 days', description: 'Business plan development', documentRequirements: ['Business Planning License'], isRequired: false },
      { id: 'consulting-research-development-technology-education', name: 'Consulting and research and development in the field of technology education', category: 'consulting', standardPrice: 5800, premiumPrice: 8800, timeline: '10-14 days', description: 'Technology education consulting and R&D', documentRequirements: ['Educational Technology License'], isRequired: false },
      { id: 'consultancy-studies-researches-natural-engineering-sciences', name: 'Consultancy, Studies and Researches in Natural and Engineering Sciences', category: 'consulting', standardPrice: 6200, premiumPrice: 9200, timeline: '10-14 days', description: 'Natural and engineering sciences consulting', documentRequirements: ['Sciences Consultancy License'], isRequired: false },
      { id: 'consultancy-studies-researches-economics', name: 'Consultancy and Studies and Researches in Economics', category: 'consulting', standardPrice: 5400, premiumPrice: 8400, timeline: '7-10 days', description: 'Economics consulting and research', documentRequirements: ['Economics License'], isRequired: false },
      { id: 'consultancy-studies-researches-linguistics', name: 'Consultancy and Studies and Researches in Linguistics', category: 'consulting', standardPrice: 4800, premiumPrice: 7800, timeline: '7-10 days', description: 'Linguistics consulting and research', documentRequirements: ['Linguistics License'], isRequired: false },
      { id: 'consultancy-studies-researches-literature-arts', name: 'Consultancy and Studies and Researches in Literature and Arts', category: 'consulting', standardPrice: 4700, premiumPrice: 7700, timeline: '7-10 days', description: 'Literature and arts consulting', documentRequirements: ['Arts License'], isRequired: false },
      { id: 'consultancy-studies-researches-renewable-energy', name: 'Consultancy and Studies and Researches in Renewable Energy', category: 'consulting', standardPrice: 6500, premiumPrice: 9500, timeline: '10-14 days', description: 'Renewable energy consulting and research', documentRequirements: ['Renewable Energy License'], isRequired: false },
      { id: 'consultancy-studies-researches-sociology', name: 'Consultancy and Studies and Researches in Sociology', category: 'consulting', standardPrice: 4900, premiumPrice: 7900, timeline: '7-10 days', description: 'Sociology consulting and research', documentRequirements: ['Sociology License'], isRequired: false },
      { id: 'administrative-consultancy-studies', name: 'Administrative Consultancy and Studies', category: 'consulting', standardPrice: 5100, premiumPrice: 8100, timeline: '7-10 days', description: 'Administrative consulting services', documentRequirements: ['Administrative License'], isRequired: false },
      { id: 'educational-consultancy', name: 'Educational Consultancy', category: 'consulting', standardPrice: 4800, premiumPrice: 7800, timeline: '5-7 days', description: 'Educational consulting services', documentRequirements: ['Educational License'], isRequired: false },
      { id: 'e-educational-consultancy', name: 'E-Educational Consultancy', category: 'consulting', standardPrice: 5000, premiumPrice: 8000, timeline: '7-10 days', description: 'Online educational consulting', documentRequirements: ['E-Education License'], isRequired: false },
      { id: 'health-consultancy-planning', name: 'Health Consultancy and Planning', category: 'consulting', standardPrice: 5800, premiumPrice: 8800, timeline: '10-14 days', description: 'Health consulting and planning', documentRequirements: ['Health Consultancy License'], isRequired: false },
      { id: 'insurance-consultancies', name: 'Insurance Consultancies', category: 'consulting', standardPrice: 5600, premiumPrice: 8600, timeline: '7-10 days', description: 'Insurance consulting services', documentRequirements: ['Insurance License'], isRequired: false },
      { id: 'investment-consultancy', name: 'Investment consultancy', category: 'consulting', standardPrice: 6200, premiumPrice: 9200, timeline: '10-14 days', description: 'Investment consulting services', documentRequirements: ['Investment License'], isRequired: false },
      { id: 'marketing-research-consultancies', name: 'Marketing Research & Consultancies', category: 'consulting', standardPrice: 5300, premiumPrice: 8300, timeline: '7-10 days', description: 'Marketing research and consulting', documentRequirements: ['Marketing Research License'], isRequired: false },
      { id: 'information-studies-consultancies', name: 'Information Studies & Consultancies', category: 'consulting', standardPrice: 5000, premiumPrice: 8000, timeline: '7-10 days', description: 'Information studies and consulting', documentRequirements: ['Information Studies License'], isRequired: false },
      { id: 'heritage-consultant', name: 'Heritage Consultant', category: 'consulting', standardPrice: 4600, premiumPrice: 7600, timeline: '7-10 days', description: 'Heritage consulting services', documentRequirements: ['Heritage License'], isRequired: false },
      { id: 'tourism-recreation-consultants', name: 'Tourism & Recreation Consultants', category: 'consulting', standardPrice: 5100, premiumPrice: 8100, timeline: '7-10 days', description: 'Tourism and recreation consulting', documentRequirements: ['Tourism License'], isRequired: false },
      { id: 'hotel-consultants', name: 'Hotel Consultants', category: 'consulting', standardPrice: 5400, premiumPrice: 8400, timeline: '7-10 days', description: 'Hotel consulting services', documentRequirements: ['Hotel Consultancy License'], isRequired: false },
      { id: 'business-events-management', name: 'Business Events Management', category: 'consulting', standardPrice: 5500, premiumPrice: 8500, timeline: '7-10 days', description: 'Business events management', documentRequirements: ['Events License'], isRequired: false },
      { id: 'event-production', name: 'Event Production', category: 'consulting', standardPrice: 5300, premiumPrice: 8300, timeline: '7-10 days', description: 'Event production services', documentRequirements: ['Event Production License'], isRequired: false },
      { id: 'event-management-esports', name: 'Event management - E-sports', category: 'consulting', standardPrice: 5600, premiumPrice: 8600, timeline: '7-10 days', description: 'E-sports event management', documentRequirements: ['E-sports License'], isRequired: false },
      { id: 'social-event-management', name: 'Social Event Management', category: 'consulting', standardPrice: 5200, premiumPrice: 8200, timeline: '7-10 days', description: 'Social event management', documentRequirements: ['Social Events License'], isRequired: false },
      { id: 'exhibition-organization-management', name: 'Exhibition Organization and Management', category: 'consulting', standardPrice: 5700, premiumPrice: 8700, timeline: '10-14 days', description: 'Exhibition organization and management', documentRequirements: ['Exhibition License'], isRequired: false },
      { id: 'festival-organization-management', name: 'Festival Organization and Management', category: 'consulting', standardPrice: 5800, premiumPrice: 8800, timeline: '10-14 days', description: 'Festival organization and management', documentRequirements: ['Festival License'], isRequired: false },
      { id: 'auctions-organization-management', name: 'Auctions Organization and Management', category: 'consulting', standardPrice: 5500, premiumPrice: 8500, timeline: '7-10 days', description: 'Auctions organization and management', documentRequirements: ['Auctions License'], isRequired: false },
      { id: 'live-theatrical-shows-management-promotion', name: 'Live Theatrical Shows Management and Promotion', category: 'consulting', standardPrice: 5900, premiumPrice: 8900, timeline: '10-14 days', description: 'Theatrical shows management', documentRequirements: ['Theatrical License'], isRequired: false },
      { id: 'aviation-consultancy', name: 'Aviation Consultancy', category: 'consulting', standardPrice: 6800, premiumPrice: 9800, timeline: '14-21 days', description: 'Aviation consulting services', documentRequirements: ['Aviation License'], isRequired: false },
      { id: 'maritime-consultancies-services', name: 'Maritime Consultancies Services', category: 'consulting', standardPrice: 6500, premiumPrice: 9500, timeline: '10-14 days', description: 'Maritime consulting services', documentRequirements: ['Maritime License'], isRequired: false },
      { id: 'customs-consultant', name: 'Customs Consultant', category: 'consulting', standardPrice: 5700, premiumPrice: 8700, timeline: '7-10 days', description: 'Customs consulting services', documentRequirements: ['Customs License'], isRequired: false },
      { id: 'feasibility-studies-consultancies', name: 'Feasibility Studies Consultancies', category: 'consulting', standardPrice: 5400, premiumPrice: 8400, timeline: '10-14 days', description: 'Feasibility studies consulting', documentRequirements: ['Feasibility Studies License'], isRequired: false },
      { id: 'cost-control-risk-management-services', name: 'Cost Control & Risk Management Services', category: 'consulting', standardPrice: 5800, premiumPrice: 8800, timeline: '7-10 days', description: 'Cost control and risk management', documentRequirements: ['Risk Management License'], isRequired: false },
      { id: 'project-management-consultancy', name: 'Project Management Consultancy', category: 'consulting', standardPrice: 5600, premiumPrice: 8600, timeline: '7-10 days', description: 'Project management consulting', documentRequirements: ['Project Management License'], isRequired: false },
      { id: 'human-resources-consultancy', name: 'Human Resources Consultancy', category: 'consulting', standardPrice: 5000, premiumPrice: 8000, timeline: '5-7 days', description: 'Human resources consulting', documentRequirements: ['HR License'], isRequired: false },
      { id: 'facilities-resources-planning-consultancy', name: 'Facilities Resources Planning Consultancy', category: 'consulting', standardPrice: 5300, premiumPrice: 8300, timeline: '7-10 days', description: 'Facilities planning consulting', documentRequirements: ['Facilities Planning License'], isRequired: false },
      { id: 'quality-standardization-consultants', name: 'Quality & Standardization Consultants', category: 'consulting', standardPrice: 5500, premiumPrice: 8500, timeline: '7-10 days', description: 'Quality and standardization consulting', documentRequirements: ['Quality License'], isRequired: false },
      { id: 'science-technology-consultancy', name: 'Science & Technology Consultancy', category: 'consulting', standardPrice: 6000, premiumPrice: 9000, timeline: '10-14 days', description: 'Science and technology consulting', documentRequirements: ['Science Technology License'], isRequired: false },
      { id: 'environmental-consultancy-studies-researches', name: 'Environmental Consultancy and Studies and Researches', category: 'consulting', standardPrice: 5700, premiumPrice: 8700, timeline: '10-14 days', description: 'Environmental consulting and research', documentRequirements: ['Environmental License'], isRequired: false },
      { id: 'environmental-consultants-studies', name: 'Environmental Consultants & Studies', category: 'consulting', standardPrice: 5600, premiumPrice: 8600, timeline: '10-14 days', description: 'Environmental consultants and studies', documentRequirements: ['Environmental Consultants License'], isRequired: false },
      { id: 'alternative-power-researches-consultancy', name: 'Alternative Power and Researches Consultancy', category: 'consulting', standardPrice: 6200, premiumPrice: 9200, timeline: '10-14 days', description: 'Alternative power research and consulting', documentRequirements: ['Alternative Power License'], isRequired: false }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering & Construction',
    description: 'Engineering consultancy and construction services',
    services: [
      { id: 'civil-engineering-consultancy', name: 'Civil Engineering Consultancy', category: 'engineering', standardPrice: 7000, premiumPrice: 12000, timeline: '10-14 days', description: 'Civil engineering design and consultancy', documentRequirements: ['Engineering License', 'Professional Certificates'], isRequired: true },
      { id: 'architectural-design-consultancy', name: 'Architectural Design Consultancy', category: 'engineering', standardPrice: 6500, premiumPrice: 11000, timeline: '10-14 days', description: 'Architectural design and planning services', documentRequirements: ['Architect License', 'Portfolio'], isRequired: false },
      { id: 'architectural-designing-engineering-city-planning-consultancy', name: 'Architectural Designing Engineering and City Planning Consultancy', category: 'engineering', standardPrice: 7200, premiumPrice: 12200, timeline: '14-21 days', description: 'Architectural design and city planning', documentRequirements: ['Architectural Planning License'], isRequired: false },
      { id: 'mechanical-engineering-consultancies', name: 'Mechanical Engineering Consultancies', category: 'engineering', standardPrice: 6800, premiumPrice: 11800, timeline: '10-14 days', description: 'Mechanical engineering consulting', documentRequirements: ['Mechanical Engineering License'], isRequired: false },
      { id: 'electrical-network-distribution-engineering-consultancy', name: 'Electrical Network & Distribution Engineering Consultancy', category: 'engineering', standardPrice: 7100, premiumPrice: 12100, timeline: '10-14 days', description: 'Electrical network and distribution engineering', documentRequirements: ['Electrical Engineering License'], isRequired: false },
      { id: 'electronic-engineering-consultancy', name: 'Electronic Engineering Consultancy', category: 'engineering', standardPrice: 6900, premiumPrice: 11900, timeline: '10-14 days', description: 'Electronic engineering consulting', documentRequirements: ['Electronic Engineering License'], isRequired: false },
      { id: 'construction-engineering-consultancy', name: 'Construction Engineering Consultancy', category: 'engineering', standardPrice: 7300, premiumPrice: 12300, timeline: '14-21 days', description: 'Construction engineering consulting', documentRequirements: ['Construction Engineering License'], isRequired: false },
      { id: 'building-mechanical-engineering-consultancy', name: 'Building Mechanical Engineering Consultancy', category: 'engineering', standardPrice: 6700, premiumPrice: 11700, timeline: '10-14 days', description: 'Building mechanical engineering', documentRequirements: ['Building Mechanical License'], isRequired: false },
      { id: 'buildings-electrical-engineering-consultancy', name: 'Buildings Electrical Engineering Consultancy', category: 'engineering', standardPrice: 6800, premiumPrice: 11800, timeline: '10-14 days', description: 'Building electrical engineering', documentRequirements: ['Building Electrical License'], isRequired: false },
      { id: 'marine-projects-engineering-consultancy', name: 'Marine Projects Engineering Consultancy', category: 'engineering', standardPrice: 7800, premiumPrice: 12800, timeline: '14-21 days', description: 'Marine projects engineering', documentRequirements: ['Marine Engineering License'], isRequired: false },
      { id: 'marine-survey-engineering-consultancy', name: 'Marine Survey Engineering Consultancy', category: 'engineering', standardPrice: 7600, premiumPrice: 12600, timeline: '14-21 days', description: 'Marine survey engineering', documentRequirements: ['Marine Survey License'], isRequired: false },
      { id: 'ship-engineering-consultancy', name: 'Ship Engineering Consultancy', category: 'engineering', standardPrice: 8000, premiumPrice: 13000, timeline: '14-21 days', description: 'Ship engineering consulting', documentRequirements: ['Ship Engineering License'], isRequired: false },
      { id: 'heavy-duty-machinery-engineering-consultancy', name: 'Heavy Duty Machinery Engineering Consultancy', category: 'engineering', standardPrice: 7500, premiumPrice: 12500, timeline: '14-21 days', description: 'Heavy machinery engineering', documentRequirements: ['Heavy Machinery License'], isRequired: false },
      { id: 'manufacturing-material-engineering-consultancy', name: 'Manufacturing & Material Engineering Consultancy', category: 'engineering', standardPrice: 7200, premiumPrice: 12200, timeline: '10-14 days', description: 'Manufacturing and material engineering', documentRequirements: ['Manufacturing Engineering License'], isRequired: false },
      { id: 'metal-engineering-consultancy', name: 'Metal Engineering Consultancy', category: 'engineering', standardPrice: 6900, premiumPrice: 11900, timeline: '10-14 days', description: 'Metal engineering consulting', documentRequirements: ['Metal Engineering License'], isRequired: false },
      { id: 'plastics-engineering-consultancy', name: 'Plastics Engineering Consultancy', category: 'engineering', standardPrice: 6600, premiumPrice: 11600, timeline: '10-14 days', description: 'Plastics engineering consulting', documentRequirements: ['Plastics Engineering License'], isRequired: false },
      { id: 'chemical-related-consultancy', name: 'Chemical Related Consultancy', category: 'engineering', standardPrice: 7400, premiumPrice: 12400, timeline: '14-21 days', description: 'Chemical engineering consulting', documentRequirements: ['Chemical Engineering License'], isRequired: false },
      { id: 'petroleum-oil-related-consultancy', name: 'Petroleum / Oil Related Consultancy', category: 'engineering', standardPrice: 8200, premiumPrice: 13200, timeline: '14-21 days', description: 'Petroleum and oil consulting', documentRequirements: ['Petroleum Engineering License'], isRequired: false },
      { id: 'petrochemical-engineering-consultancy', name: 'Petrochemical Engineering Consultancy', category: 'engineering', standardPrice: 8000, premiumPrice: 13000, timeline: '14-21 days', description: 'Petrochemical engineering consulting', documentRequirements: ['Petrochemical Engineering License'], isRequired: false },
      { id: 'oil-exploration-engineering-consultancy', name: 'Oil Exploration Engineering Consultancy', category: 'engineering', standardPrice: 8500, premiumPrice: 13500, timeline: '21-30 days', description: 'Oil exploration engineering', documentRequirements: ['Oil Exploration License'], isRequired: false },
      { id: 'oil-refining-engineering-consultancy', name: 'Oil Refining Engineering Consultancy', category: 'engineering', standardPrice: 8300, premiumPrice: 13300, timeline: '14-21 days', description: 'Oil refining engineering', documentRequirements: ['Oil Refining License'], isRequired: false },
      { id: 'petroleum-refining-plants-engineering-consultancy', name: 'Petroleum Refining plants Engineering Consultancy', category: 'engineering', standardPrice: 8400, premiumPrice: 13400, timeline: '21-30 days', description: 'Petroleum refining plants engineering', documentRequirements: ['Refining Plants License'], isRequired: false },
      { id: 'power-automatic-control-engineering-consultancy', name: 'Power & Automatic Control Engineering Consultancy', category: 'engineering', standardPrice: 7600, premiumPrice: 12600, timeline: '14-21 days', description: 'Power and automatic control engineering', documentRequirements: ['Power Control License'], isRequired: false },
      { id: 'energy-projects-engineering-consultancy', name: 'Energy Projects Engineering Consultancy', category: 'engineering', standardPrice: 7800, premiumPrice: 12800, timeline: '14-21 days', description: 'Energy projects engineering', documentRequirements: ['Energy Projects License'], isRequired: false },
      { id: 'renewable-energy-engineering-consultancy', name: 'Renewable Energy Engineering Consultancy', category: 'engineering', standardPrice: 7700, premiumPrice: 12700, timeline: '14-21 days', description: 'Renewable energy engineering', documentRequirements: ['Renewable Energy Engineering License'], isRequired: false },
      { id: 'fire-safety-protection-engineering-consultancy', name: 'Fire Safety &Protection Engineering Consultancy', category: 'engineering', standardPrice: 7000, premiumPrice: 12000, timeline: '10-14 days', description: 'Fire safety and protection engineering', documentRequirements: ['Fire Safety License'], isRequired: false },
      { id: 'noise-control-vibration-acoustics-consultancy', name: 'Noise Control, Vibration & Acoustics Consultancy', category: 'engineering', standardPrice: 6800, premiumPrice: 11800, timeline: '10-14 days', description: 'Noise control and acoustics consulting', documentRequirements: ['Acoustics License'], isRequired: false },
      { id: 'hydraulic-engineering-consultancy', name: 'Hydraulic Engineering Consultancy', category: 'engineering', standardPrice: 7100, premiumPrice: 12100, timeline: '10-14 days', description: 'Hydraulic engineering consulting', documentRequirements: ['Hydraulic Engineering License'], isRequired: false },
      { id: 'railway-development-engineering-consultancy', name: 'Railway Development Engineering Consultancy', category: 'engineering', standardPrice: 8000, premiumPrice: 13000, timeline: '21-30 days', description: 'Railway development engineering', documentRequirements: ['Railway Engineering License'], isRequired: false },
      { id: 'road-traffic-engineering-consultancy', name: 'Road & Traffic Engineering Consultancy', category: 'engineering', standardPrice: 7300, premiumPrice: 12300, timeline: '14-21 days', description: 'Road and traffic engineering', documentRequirements: ['Traffic Engineering License'], isRequired: false },
      { id: 'tunnels-bridges-engineering-consultancy', name: 'Tunnels & Bridges Engineering Consultancy', category: 'engineering', standardPrice: 8200, premiumPrice: 13200, timeline: '21-30 days', description: 'Tunnels and bridges engineering', documentRequirements: ['Bridges Engineering License'], isRequired: false },
      { id: 'urban-planning-engineering-consultancy', name: 'Urban Planning Engineering Consultancy', category: 'engineering', standardPrice: 7500, premiumPrice: 12500, timeline: '14-21 days', description: 'Urban planning engineering', documentRequirements: ['Urban Planning License'], isRequired: false },
      { id: 'landscaping-engineering-consultancy', name: 'Landscaping Engineering Consultancy', category: 'engineering', standardPrice: 6500, premiumPrice: 11500, timeline: '10-14 days', description: 'Landscaping engineering', documentRequirements: ['Landscaping License'], isRequired: false },
      { id: 'surveying-engineering-consultancy', name: 'Surveying Engineering Consultancy', category: 'engineering', standardPrice: 6800, premiumPrice: 11800, timeline: '10-14 days', description: 'Surveying engineering', documentRequirements: ['Surveying License'], isRequired: false },
      { id: 'planning-photogrammetry-engineering-consultancy', name: 'Planning & Photogrammetry Engineering Consultancy', category: 'engineering', standardPrice: 7000, premiumPrice: 12000, timeline: '14-21 days', description: 'Planning and photogrammetry engineering', documentRequirements: ['Photogrammetry License'], isRequired: false },
      { id: 'hydrographic-engineering-surveying-consultancy', name: 'Hydrographic Engineering Surveying Consultancy', category: 'engineering', standardPrice: 7200, premiumPrice: 12200, timeline: '14-21 days', description: 'Hydrographic engineering surveying', documentRequirements: ['Hydrographic License'], isRequired: false },
      { id: 'geodetic-engineering-surveying-consultancy', name: 'Geodetic Engineering Surveying Consultancy', category: 'engineering', standardPrice: 7100, premiumPrice: 12100, timeline: '14-21 days', description: 'Geodetic engineering surveying', documentRequirements: ['Geodetic License'], isRequired: false },
      { id: 'foundations-soil-mechanics-engineering-consultancy', name: 'Foundations & Soil Mechanics Engineering Consultancy', category: 'engineering', standardPrice: 7300, premiumPrice: 12300, timeline: '14-21 days', description: 'Foundations and soil mechanics engineering', documentRequirements: ['Soil Mechanics License'], isRequired: false },
      { id: 'structural-quantity-surveying-consultancy', name: 'Structural Quantity Surveying Consultancy', category: 'engineering', standardPrice: 6900, premiumPrice: 11900, timeline: '10-14 days', description: 'Structural quantity surveying', documentRequirements: ['Quantity Surveying License'], isRequired: false },
      { id: 'interior-design-engineering-consultancy', name: 'Interior Design Engineering Consultancy', category: 'engineering', standardPrice: 6200, premiumPrice: 11200, timeline: '10-14 days', description: 'Interior design engineering', documentRequirements: ['Interior Design License'], isRequired: false },
      { id: 'green-buildings-engineering-consultancy', name: 'Green Buildings Engineering Consultancy', category: 'engineering', standardPrice: 7400, premiumPrice: 12400, timeline: '14-21 days', description: 'Green buildings engineering', documentRequirements: ['Green Buildings License'], isRequired: false },
      { id: 'buildings-energy-efficiency-consultancy', name: 'Buildings Energy Efficiency Consultancy', category: 'engineering', standardPrice: 7200, premiumPrice: 12200, timeline: '14-21 days', description: 'Building energy efficiency consulting', documentRequirements: ['Energy Efficiency License'], isRequired: false },
      { id: 'meterology-engineering-consultancy', name: 'Meterology Engineering Consultancy', category: 'engineering', standardPrice: 6800, premiumPrice: 11800, timeline: '10-14 days', description: 'Meteorology engineering', documentRequirements: ['Meteorology License'], isRequired: false },
      { id: 'physical-engineering-consultancy', name: 'Physical Engineering Consultancy', category: 'engineering', standardPrice: 6700, premiumPrice: 11700, timeline: '10-14 days', description: 'Physical engineering consulting', documentRequirements: ['Physical Engineering License'], isRequired: false },
      { id: 'communication-engineering-consultancy', name: 'Communication Engineering Consultancy', category: 'engineering', standardPrice: 7000, premiumPrice: 12000, timeline: '10-14 days', description: 'Communication engineering', documentRequirements: ['Communication Engineering License'], isRequired: false },
      { id: 'medical-engineering-consultancy', name: 'Medical Engineering Consultancy', category: 'engineering', standardPrice: 7800, premiumPrice: 12800, timeline: '14-21 days', description: 'Medical engineering consulting', documentRequirements: ['Medical Engineering License'], isRequired: false },
      { id: 'automobile-engineering-consultancy', name: 'Automobile Engineering Consultancy', category: 'engineering', standardPrice: 7400, premiumPrice: 12400, timeline: '14-21 days', description: 'Automobile engineering consulting', documentRequirements: ['Automobile Engineering License'], isRequired: false },
      { id: 'gas-extraction-engineering-consultancy', name: 'Gas Extraction Engineering Consultancy', category: 'engineering', standardPrice: 8100, premiumPrice: 13100, timeline: '21-30 days', description: 'Gas extraction engineering', documentRequirements: ['Gas Extraction License'], isRequired: false },
      { id: 'drilling-stock-production-engineering-consultancy', name: 'Drilling, Stock & Production Engineering Consultancy', category: 'engineering', standardPrice: 8300, premiumPrice: 13300, timeline: '21-30 days', description: 'Drilling and production engineering', documentRequirements: ['Drilling Engineering License'], isRequired: false },
      { id: 'raw-materials-composition-engineering-consultancy', name: 'Raw-Materials Composition Engineering Consultancy', category: 'engineering', standardPrice: 7100, premiumPrice: 12100, timeline: '10-14 days', description: 'Raw materials composition engineering', documentRequirements: ['Materials Engineering License'], isRequired: false },
      { id: 'industrial-production-engineering-consultancy', name: 'Industrial Production Engineering Consultancy', category: 'engineering', standardPrice: 7600, premiumPrice: 12600, timeline: '14-21 days', description: 'Industrial production engineering', documentRequirements: ['Industrial Engineering License'], isRequired: false },
      { id: 'mechanical-power-engineering-consultancy', name: 'Mechanical Power Engineering Consultancy', category: 'engineering', standardPrice: 7300, premiumPrice: 12300, timeline: '14-21 days', description: 'Mechanical power engineering', documentRequirements: ['Mechanical Power License'], isRequired: false },
      { id: 'power-oil-gas-consultancy', name: 'Power, Oil and Gas Consultancy', category: 'engineering', standardPrice: 8400, premiumPrice: 13400, timeline: '21-30 days', description: 'Power, oil and gas consulting', documentRequirements: ['Power Oil Gas License'], isRequired: false },
      { id: 'industrial-installations-inspection-engineering-consultancy', name: 'Industrial Installations Inspection Engineering Consultancy', category: 'engineering', standardPrice: 7500, premiumPrice: 12500, timeline: '14-21 days', description: 'Industrial installations inspection', documentRequirements: ['Industrial Inspection License'], isRequired: false },
      { id: 'mining-mines-equipment-engineering-consultancy', name: 'Mining & Mines Equipment Engineering Consultancy', category: 'engineering', standardPrice: 7800, premiumPrice: 12800, timeline: '14-21 days', description: 'Mining and mines equipment engineering', documentRequirements: ['Mining Equipment License'], isRequired: false },
      { id: 'mines-mining-geological-engineering-consultancy', name: 'Mines, Mining & Geological Engineering Consultancy', category: 'engineering', standardPrice: 8000, premiumPrice: 13000, timeline: '21-30 days', description: 'Mining and geological engineering', documentRequirements: ['Mining Geological License'], isRequired: false },
      { id: 'mining-oil-water-geological-consultancy', name: 'Mining, Oil & Water Geological Consultancy', category: 'engineering', standardPrice: 8200, premiumPrice: 13200, timeline: '21-30 days', description: 'Mining, oil and water geological consulting', documentRequirements: ['Geological Consultancy License'], isRequired: false },
      { id: 'geological-geophysical-consultancy-studies-researches', name: 'Geological and Geophysical Consultancy and Studies and Researches', category: 'engineering', standardPrice: 7900, premiumPrice: 12900, timeline: '21-30 days', description: 'Geological and geophysical consulting', documentRequirements: ['Geophysical Consultancy License'], isRequired: false },
      { id: 'geophysical-geochemical-geomechanical-engineering-consultancy', name: 'Geophysical, Geochemical & Geomechanical Engineering Consultancy', category: 'engineering', standardPrice: 8100, premiumPrice: 13100, timeline: '21-30 days', description: 'Geophysical and geochemical engineering', documentRequirements: ['Geomechanical License'], isRequired: false },
      { id: 'water-sewage-irrigation-engineering-consultancy', name: 'Water, Sewage & Irrigation Engineering Consultancy', category: 'engineering', standardPrice: 7400, premiumPrice: 12400, timeline: '14-21 days', description: 'Water and sewage engineering', documentRequirements: ['Water Engineering License'], isRequired: false },
      { id: 'oil-gas-tanks-pipes-construction-engineering-consultancy', name: 'Oil & Gas Tank\'s Pipes Construction Engineering Consultancy', category: 'engineering', standardPrice: 8300, premiumPrice: 13300, timeline: '21-30 days', description: 'Oil and gas tanks construction engineering', documentRequirements: ['Oil Gas Construction License'], isRequired: false },
      { id: 'ports-engineering-consultancies', name: 'Ports Engineering Consultancies', category: 'engineering', standardPrice: 8000, premiumPrice: 13000, timeline: '21-30 days', description: 'Ports engineering consulting', documentRequirements: ['Ports Engineering License'], isRequired: false },
      { id: 'civil-architectural-engineering-decor-consultancy', name: 'Civil and Architectural Engineering and Décor Consultancy', category: 'engineering', standardPrice: 7000, premiumPrice: 12000, timeline: '14-21 days', description: 'Civil, architectural and decor consulting', documentRequirements: ['Civil Architectural License'], isRequired: false },
      { id: 'civil-work-transportation-consultancy', name: 'Civil Work and Transportation Consultancy', category: 'engineering', standardPrice: 7500, premiumPrice: 12500, timeline: '14-21 days', description: 'Civil work and transportation consulting', documentRequirements: ['Civil Transportation License'], isRequired: false },
      { id: 'ports-marine-guide-equipment-trading', name: 'Ports & Marine Guide Equipment Trading', category: 'engineering', standardPrice: 6800, premiumPrice: 10800, timeline: '10-14 days', description: 'Ports and marine equipment trading', documentRequirements: ['Marine Equipment License'], isRequired: false },
      { id: 'archeological-restoration-conservation-engineering-consultancy', name: 'Archeological Restoration & Conservation Engineering Consultancy', category: 'engineering', standardPrice: 7200, premiumPrice: 12200, timeline: '21-30 days', description: 'Archaeological restoration engineering', documentRequirements: ['Archaeological License'], isRequired: false },
      { id: 'engineering-consultancy-tectonic-monitoring-earth-faults', name: 'Engineering Consultancy in tectonic monitoring and earth faults', category: 'engineering', standardPrice: 7800, premiumPrice: 12800, timeline: '21-30 days', description: 'Tectonic monitoring engineering', documentRequirements: ['Tectonic Monitoring License'], isRequired: false },
      { id: 'projects-management-engineering-technical-feasibility-studies-consultancy', name: 'Projects Management Engineering & Technical Feasibility Studies Consultancy', category: 'engineering', standardPrice: 7600, premiumPrice: 12600, timeline: '14-21 days', description: 'Project management and feasibility studies', documentRequirements: ['Project Management Engineering License'], isRequired: false },
      { id: 'architectural-prospective-drawings-consultancy', name: 'Architectural Prospective Drawings Consultancy', category: 'engineering', standardPrice: 6400, premiumPrice: 10400, timeline: '10-14 days', description: 'Architectural drawings consulting', documentRequirements: ['Architectural Drawings License'], isRequired: false },
      { id: 'vertical-horizontal-transportation-systems-consultant', name: 'Vertical & Horizontal Transportation Systems Consultant', category: 'engineering', standardPrice: 7700, premiumPrice: 12700, timeline: '14-21 days', description: 'Transportation systems consulting', documentRequirements: ['Transportation Systems License'], isRequired: false },
      { id: 'technical-installations-consultancies', name: 'Technical Installations Consultancies', category: 'engineering', standardPrice: 7100, premiumPrice: 12100, timeline: '10-14 days', description: 'Technical installations consulting', documentRequirements: ['Technical Installations License'], isRequired: false },
      { id: 'interior-design-consultancy-services', name: 'Interior Design Consultancy Services', category: 'engineering', standardPrice: 6000, premiumPrice: 10000, timeline: '10-14 days', description: 'Interior design consultancy', documentRequirements: ['Interior Design Consultancy License'], isRequired: false },
      { id: 'interior-design-engineering-services', name: 'Interior Design Engineering Services', category: 'engineering', standardPrice: 6200, premiumPrice: 10200, timeline: '10-14 days', description: 'Interior design engineering', documentRequirements: ['Interior Design Engineering License'], isRequired: false },
      { id: 'turnkey-projects-contracting', name: 'Turnkey Projects Contracting', category: 'engineering', standardPrice: 8500, premiumPrice: 13500, timeline: '30-45 days', description: 'Turnkey project contracting', documentRequirements: ['Turnkey Contracting License'], isRequired: false }
    ]
  }
];

const MOCK_VISA_TYPES: VisaType[] = [
  {
    id: 'investor',
    name: 'Investor Visa',
    description: 'For business owners and investors',
    price: 3000,
    processingTime: '7-10 days'
  },
  {
    id: 'employee',
    name: 'Employee Visa',
    description: 'For employees and staff members',
    price: 2500,
    processingTime: '5-7 days'
  },
  {
    id: 'dependent',
    name: 'Dependent Visa',
    description: 'For family members',
    price: 2000,
    processingTime: '3-5 days'
  },
  {
    id: 'partner',
    name: 'Partner Visa',
    description: 'For business partners',
    price: 2800,
    processingTime: '7-10 days'
  }
];

export const useGoogleSheetsData = () => {
  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to Google Sheets
    const fetchData = async () => {
      setIsLoading(true);
      
      // In a real implementation, you would:
      // 1. Use Google Sheets API
      // 2. Parse CSV data from the sheets
      // 3. Transform data into the required format
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setBusinessCategories(MOCK_BUSINESS_CATEGORIES);
        setVisaTypes(MOCK_VISA_TYPES);
      } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getServicesByCategory = (categoryId: string): BusinessService[] => {
    const category = businessCategories.find(cat => cat.id === categoryId);
    return category?.services || [];
  };

  const calculatePricing = (
    selectedServices: string[],
    shareholders: number,
    visas: number,
    tenure: number,
    entityType: string
  ) => {
    // Mock pricing calculation - replace with actual Google Sheets data
    const services = businessCategories
      .flatMap(cat => cat.services)
      .filter(service => selectedServices.includes(service.id));
    
    const serviceCosts = services.reduce((total, service) => total + service.standardPrice, 0);
    const baseCost = entityType === 'freezone' ? 15000 : 12000;
    const shareholderCost = Math.max(0, shareholders - 1) * 1500;
    const visaCost = visas * 2500;
    const tenureFactor = tenure === 1 ? 1 : tenure === 3 ? 2.8 : 4.5;
    
    const totalPrice = (baseCost + serviceCosts + shareholderCost + visaCost) * tenureFactor;
    
    return {
      basePrice: baseCost * tenureFactor,
      serviceCosts: serviceCosts * tenureFactor,
      visaCosts: visaCost * tenureFactor,
      shareholderCosts: shareholderCost * tenureFactor,
      totalPrice,
      estimatedTimeline: `${Math.max(...services.map(s => parseInt(s.timeline)))} days`
    };
  };

  return {
    businessCategories,
    visaTypes,
    isLoading,
    getServicesByCategory,
    calculatePricing
  };
};