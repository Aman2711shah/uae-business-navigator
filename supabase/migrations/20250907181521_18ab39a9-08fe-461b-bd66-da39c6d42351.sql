-- Create leads table for form submissions (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leads') THEN
    CREATE TABLE public.leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      form_name text NOT NULL,
      email text,
      firstname text,
      lastname text,
      phone text,
      service text,
      notes text,
      file_url text,
      file_name text,
      fields jsonb DEFAULT '{}',
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Admins can manage all leads" ON public.leads;
DROP POLICY IF EXISTS "Leads are readable by authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

-- Create policies
CREATE POLICY "Admins can manage all leads" ON public.leads
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Leads are readable by authenticated users" ON public.leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for inserting leads (allow anonymous submissions)
CREATE POLICY "Anyone can submit leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON public.leads TO authenticated;
GRANT SELECT, INSERT ON public.leads TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_form_name ON public.leads (form_name);