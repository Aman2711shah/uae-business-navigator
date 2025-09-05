-- Create storage bucket for service uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-uploads', 'service-uploads', false);

-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  service_id UUID NOT NULL REFERENCES public.services(id),
  sub_service_id UUID REFERENCES public.sub_services(id),
  status TEXT NOT NULL DEFAULT 'pending',
  contact_info JSONB NOT NULL DEFAULT '{}',
  total_price NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submission_documents table
CREATE TABLE IF NOT EXISTS public.submission_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for submissions
CREATE POLICY "Users can create submissions" 
ON public.submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own submissions" 
ON public.submissions FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can manage all submissions" 
ON public.submissions FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for submission_documents
CREATE POLICY "Users can upload documents for submissions" 
ON public.submission_documents FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.submissions 
  WHERE id = submission_id 
  AND (user_id = auth.uid() OR user_id IS NULL)
));

CREATE POLICY "Users can view their own submission documents" 
ON public.submission_documents FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.submissions 
  WHERE id = submission_id 
  AND (user_id = auth.uid() OR user_id IS NULL)
));

CREATE POLICY "Admins can manage all submission documents" 
ON public.submission_documents FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage policies for service uploads
CREATE POLICY "Service uploads are viewable by submission owners" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'service-uploads' AND (
  EXISTS (
    SELECT 1 FROM public.submission_documents sd
    JOIN public.submissions s ON sd.submission_id = s.id
    WHERE sd.storage_path = name 
    AND (s.user_id = auth.uid() OR s.user_id IS NULL)
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
));

CREATE POLICY "Authenticated users can upload service documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'service-uploads');

-- Create trigger for updated_at on submissions
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();