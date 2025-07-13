-- Insert comprehensive business setup Q&As into knowledge_base
INSERT INTO knowledge_base (question, answer, category) VALUES
-- Company Types & Setup
('What is the difference between Freezone and Mainland company?', 'Freezone companies offer 100% foreign ownership and are limited to operating within the Freezone or internationally. Mainland companies are registered with DED and can operate across the UAE, including with government entities.', 'company_types'),
('What is an Offshore company in the UAE?', 'An offshore company is primarily used for holding assets, international trade, or tax optimization. It cannot operate in the UAE market directly.', 'company_types'),
('Can I open a company in UAE without visiting?', 'Yes, many Freezones allow remote setup. However, certain services like bank account opening may require your physical presence.', 'setup_process'),
('What is the cheapest Freezone in the UAE?', 'Freezones like SHAMS, SPC, and RAKEZ offer cost-effective packages starting as low as AED 5,750.', 'costs'),
('How do I choose the right Freezone?', 'It depends on your business activity, visa requirements, office needs, and budget. GoPRO can help you compare the best options.', 'freezone_selection'),
('What are the steps to register a company in Dubai?', 'Steps include choosing the structure, selecting a name, applying for a license, submitting documents, and opening a bank account.', 'setup_process'),
('Can I own 100% of my company in the UAE?', 'Yes, both Freezone and many Mainland activities now allow full foreign ownership.', 'ownership'),
('What is the minimum capital requirement for UAE company formation?', 'Most Freezones do not require actual capital deposits, though they may mention AED 10,000 to 50,000 on paper.', 'capital_requirements'),
('Can I register multiple business activities under one license?', 'Yes, depending on the authority and the license type. Some zones allow combining related activities.', 'licensing'),
('How do I renew a business license in a Freezone?', 'You can renew online or through your Freezone portal by paying the renewal fee and submitting any updated documents.', 'renewal'),

-- Documents & Requirements
('What documents are required to register a Freezone company?', 'Passport, photo, visa copy or entry stamp, Emirates ID (if any), and utility bill for address proof.', 'documents'),
('What documents are required for Mainland company setup?', 'Passport, visa, Emirates ID, tenancy contract, trade name reservation, and initial approval documents.', 'documents'),
('Do I need a physical office for company registration?', 'Freezones offer Flexi-desks or virtual offices. Mainland setups typically need an Ejari-registered lease.', 'office_requirements'),
('What is an Ejari and is it mandatory?', 'Ejari is Dubai''s tenancy contract registration system. It''s mandatory for visa issuance in Mainland.', 'office_requirements'),
('Can a foreigner open a business in UAE?', 'Yes, UAE allows foreign nationals to register companies, especially in Freezones and for many Mainland activities.', 'eligibility'),

-- Licensing
('What types of trade licenses are available in the UAE?', 'Commercial, Professional, Industrial, Holding, and Freelance licenses.', 'licensing'),
('What is a commercial license?', 'It allows you to engage in trading activities like import/export, retail, or wholesale.', 'licensing'),
('What is a professional license?', 'It''s for service-based businesses like consultancy, marketing, or IT services.', 'licensing'),
('What is an industrial license?', 'For businesses involved in manufacturing, assembly, or production of goods.', 'licensing'),
('How much does a trade license cost in Dubai?', 'It ranges from AED 7,000 to AED 25,000+ depending on the type, Freezone, and number of visas.', 'costs'),

-- Visa & Immigration
('What is an investor visa?', 'It''s a residency visa for company shareholders that usually lasts 2–10 years depending on investment.', 'visas'),
('What are the steps to get a partner visa in UAE?', 'Apply after company setup → medical test → Emirates ID application → visa stamping.', 'visas'),
('How many visas can I apply for under a Freezone license?', 'It depends on your package and office space. Flexi-desk may allow 1–3 visas.', 'visas'),
('Can I sponsor my family under a business visa?', 'Yes, investor and partner visa holders can sponsor spouses, children, and parents.', 'visas'),
('What are the medical test requirements for UAE residency?', 'Blood test and chest X-ray are mandatory to screen for communicable diseases.', 'visas'),

-- Banking & Finance
('How do I open a business bank account in UAE?', 'After licensing, submit documents to banks like Emirates NBD, Mashreq, ADCB, etc. Approval may take 7–21 days.', 'banking'),
('What documents are required for corporate banking?', 'License, MOA, passport copy, Emirates ID, utility bill, business plan, and sometimes invoices/contracts.', 'banking'),
('Can a Freezone company get a bank account?', 'Yes, though banks may ask for additional verification and business proof.', 'banking'),
('What are the challenges in opening a UAE bank account?', 'Compliance checks, KYC documentation, and proving business activity can cause delays.', 'banking'),
('Which UAE banks are best for startups?', 'Emirates NBD, RAKBank, Wio, Mashreq NeoBiz are startup-friendly.', 'banking'),

-- Compliance & Tax
('Do I need to register for VAT?', 'If your revenue exceeds AED 375,000 annually, VAT registration with FTA is mandatory.', 'tax'),
('What is UBO (Ultimate Beneficial Owner) filing?', 'UBO regulations require companies to disclose the real individual(s) behind the ownership to authorities.', 'compliance'),
('What are the accounting and audit requirements?', 'Mainland companies and some Freezones require audited financials; all should maintain proper bookkeeping.', 'compliance'),

-- Freezones Overview
('What are the benefits of setting up in DMCC?', 'DMCC is centrally located, internationally recognized, and ideal for commodities, crypto, and trade.', 'freezones'),
('How is SHAMS Freezone different from SPC?', 'SHAMS is more media and digital focused, while SPC is known for affordable general trading and consulting packages.', 'freezones'),
('What incentives do IFZA Freezone offer?', 'Competitive pricing, multi-year packages, and business-friendly visa policies.', 'freezones'),
('Which Freezones allow virtual offices?', 'SHAMS, SPC, RAKEZ, and IFZA offer Flexi-desk or smart desk options.', 'freezones'),
('What is the process to transfer a company between Freezones?', 'It involves canceling your current license and re-registering in the new Freezone. Consult your advisor for seamless handling.', 'freezones'),

-- Operations & Growth
('Can I upgrade my Freezone license later?', 'Yes, most Freezones allow license upgrades or business activity changes.', 'operations'),
('How do I change shareholders in my company?', 'A share transfer agreement and amendment of the license must be filed with the authority.', 'operations'),
('Can I add or remove a business activity?', 'Yes, this is possible during license renewal or by applying for an amendment.', 'operations'),
('Can I operate in Mainland with a Freezone license?', 'Only through local distributors or agents. Direct trading is not allowed without proper approvals.', 'operations'),
('What support services does GoPRO provide?', 'GoPRO offers setup consultation, license processing, visa support, compliance advisory, and document handling.', 'services'),

-- Miscellaneous
('What is the Golden Visa and how can I qualify?', 'It''s a 10-year UAE residency visa for investors, professionals, and exceptional talent. Criteria include property ownership, business investment, or nomination.', 'special_visas'),
('Can I apply for a freelance license in UAE?', 'Yes, many Freezones offer freelance permits especially for media, tech, and consultancy professionals.', 'licensing'),
('Is health insurance mandatory for business visa holders?', 'Yes, all UAE residents including visa holders must have valid health insurance.', 'requirements'),
('Can I setup an e-commerce company in UAE?', 'Absolutely. Freezones like SHAMS and SPC support e-commerce and online businesses with dedicated license options.', 'business_types'),
('How can I track my business setup application status?', 'Use the "Track Application" feature in your GoPRO app to monitor updates and uploaded document status.', 'services');