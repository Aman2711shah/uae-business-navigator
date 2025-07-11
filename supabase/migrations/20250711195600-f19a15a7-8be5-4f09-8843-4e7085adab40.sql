-- Create applications table
CREATE TABLE public.applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  freezone_name text NOT NULL,
  package_id integer REFERENCES public.packages(id),
  package_name text NOT NULL,
  package_type text NOT NULL,
  legal_entity_type text NOT NULL,
  number_of_shareholders integer NOT NULL DEFAULT 1,
  number_of_visas integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft',
  submitted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create document requirements table
CREATE TABLE public.document_requirements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  freezone_name text NOT NULL,
  legal_entity_type text NOT NULL,
  document_name text NOT NULL,
  document_description text,
  is_required boolean NOT NULL DEFAULT true,
  document_type text NOT NULL DEFAULT 'upload',
  template_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create document uploads table
CREATE TABLE public.document_uploads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE,
  document_requirement_id uuid REFERENCES public.document_requirements(id),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  upload_status text NOT NULL DEFAULT 'pending',
  uploaded_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create freezone information table
CREATE TABLE public.freezone_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  freezone_name text NOT NULL UNIQUE,
  description text,
  key_benefits text[],
  office_location text,
  website_url text,
  contact_email text,
  contact_phone text,
  faqs jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freezone_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all applications" 
ON public.applications 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for document requirements
CREATE POLICY "Document requirements are publicly readable" 
ON public.document_requirements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage document requirements" 
ON public.document_requirements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for document uploads
CREATE POLICY "Users can view their own document uploads" 
ON public.document_uploads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE applications.id = document_uploads.application_id 
    AND applications.user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload documents for their applications" 
ON public.document_uploads 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE applications.id = document_uploads.application_id 
    AND applications.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own document uploads" 
ON public.document_uploads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE applications.id = document_uploads.application_id 
    AND applications.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all document uploads" 
ON public.document_uploads 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for freezone info
CREATE POLICY "Freezone info is publicly readable" 
ON public.freezone_info 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage freezone info" 
ON public.freezone_info 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('application-documents', 'application-documents', false);

-- Storage policies for application documents
CREATE POLICY "Users can upload documents for their applications" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own application documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own application documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own application documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can manage all application documents" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'application-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add updated_at trigger for applications
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for freezone_info
CREATE TRIGGER update_freezone_info_updated_at
BEFORE UPDATE ON public.freezone_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample document requirements
INSERT INTO public.document_requirements (freezone_name, legal_entity_type, document_name, document_description, is_required) VALUES
('ADGM', 'FZ-LLC', 'Passport Copy', 'Clear colored copy of passport for all shareholders', true),
('ADGM', 'FZ-LLC', 'Emirates ID Copy', 'Copy of Emirates ID (if applicable)', false),
('ADGM', 'FZ-LLC', 'Business Plan', 'Detailed business plan outlining company activities', true),
('ADGM', 'FZ-LLC', 'Visa Copy', 'Copy of current UAE visa (if applicable)', false),
('ADGM', 'FZ-LLC', 'Address Proof', 'Utility bill or bank statement for address verification', true),
('ADGM', 'Branch', 'Parent Company Documents', 'Certificate of incorporation and memorandum of parent company', true),
('ADGM', 'Branch', 'Board Resolution', 'Board resolution authorizing branch establishment', true),
('ADGM', 'Branch', 'Power of Attorney', 'Power of attorney for authorized signatory', true);

-- Insert sample freezone information
INSERT INTO public.freezone_info (freezone_name, description, key_benefits, office_location, website_url, contact_email, faqs) VALUES
('Abu Dhabi Global Market (ADGM)', 'ADGM is a leading international financial centre that provides world-class enabling legislation, regulation and business environment for local and international institutions.', 
ARRAY['100% Foreign Ownership', 'Zero Corporate Tax for 50 Years', 'No Personal Income Tax', 'Full Repatriation of Capital & Profits', 'Access to DIFC Courts'], 
'Al Maryah Island, Abu Dhabi, UAE', 'https://www.adgm.com', 'info@adgm.com',
'{"What is ADGM?": "Abu Dhabi Global Market is an international financial centre located in Abu Dhabi.", "What are the benefits?": "100% foreign ownership, zero corporate tax, and access to regional markets.", "How long does setup take?": "Typically 2-4 weeks depending on documentation."}'::jsonb),

('Sharjah Media City (Shams)', 'Sharjah Media City is the first specialised media free zone in the Northern Emirates, supporting creative industries and media businesses.',
ARRAY['100% Foreign Ownership', 'Zero Corporate Tax', 'No Personal Income Tax', 'Full Repatriation of Profits', 'Media Industry Focus'],
'University City Road, Sharjah, UAE', 'https://www.shams.ae', 'info@shams.ae',
'{"What is SHAMS?": "Sharjah Media City is a specialized free zone for media and creative industries.", "What sectors are allowed?": "Media, advertising, digital marketing, content creation, and creative services.", "What are the visa options?": "Employment visas for shareholders and employees based on business activity."}'::jsonb);