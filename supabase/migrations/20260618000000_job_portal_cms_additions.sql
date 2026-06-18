-- Slugify function for generating URL-safe strings
CREATE OR REPLACE FUNCTION public.slugify(value text)
RETURNS text AS $$
DECLARE
  l_res text;
BEGIN
  l_res := lower(value);
  -- Replace non-alphanumeric with hyphen
  l_res := regexp_replace(l_res, '[^a-z0-9\-_]+', '-', 'gi');
  -- Remove duplicate/surrounding hyphens
  l_res := regexp_replace(l_res, '^-|-$', '', 'g');
  l_res := regexp_replace(l_res, '-+', '-', 'g');
  IF l_res = '' THEN
    l_res := 'item-' || substring(gen_random_uuid()::text, 1, 8);
  END IF;
  RETURN l_res;
END;
$$ LANGUAGE plpgsql STRICT IMMUTABLE;

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  industry TEXT,
  location TEXT,
  website_url TEXT,
  open_jobs_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  og_image TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create articles table for Career Guidance
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  og_image TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alter jobs table to add new CMS features
DO $$
BEGIN
  -- Add company_id reference
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'company_id') THEN
    ALTER TABLE public.jobs ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;

  -- Add work_mode (Remote / Hybrid / Onsite)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'work_mode') THEN
    ALTER TABLE public.jobs ADD COLUMN work_mode TEXT DEFAULT 'Onsite';
  END IF;

  -- Add department
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'department') THEN
    ALTER TABLE public.jobs ADD COLUMN department TEXT;
  END IF;

  -- Add qualification
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'qualification') THEN
    ALTER TABLE public.jobs ADD COLUMN qualification TEXT;
  END IF;

  -- Add required_skills
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'required_skills') THEN
    ALTER TABLE public.jobs ADD COLUMN required_skills TEXT;
  END IF;

  -- Add responsibilities
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'responsibilities') THEN
    ALTER TABLE public.jobs ADD COLUMN responsibilities TEXT;
  END IF;

  -- Add benefits
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'benefits') THEN
    ALTER TABLE public.jobs ADD COLUMN benefits TEXT;
  END IF;

  -- Add featured toggle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'featured') THEN
    ALTER TABLE public.jobs ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;

  -- Add published_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'published_date') THEN
    ALTER TABLE public.jobs ADD COLUMN published_date DATE DEFAULT CURRENT_DATE;
  END IF;

  -- Add status (active / expired / archived)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status') THEN
    ALTER TABLE public.jobs ADD COLUMN status TEXT DEFAULT 'active';
  END IF;

  -- Add URL slug
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'slug') THEN
    ALTER TABLE public.jobs ADD COLUMN slug TEXT UNIQUE;
  END IF;

  -- Add SEO fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'seo_title') THEN
    ALTER TABLE public.jobs ADD COLUMN seo_title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'seo_description') THEN
    ALTER TABLE public.jobs ADD COLUMN seo_description TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'focus_keyword') THEN
    ALTER TABLE public.jobs ADD COLUMN focus_keyword TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'canonical_url') THEN
    ALTER TABLE public.jobs ADD COLUMN canonical_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'og_image') THEN
    ALTER TABLE public.jobs ADD COLUMN og_image TEXT;
  END IF;
END $$;

-- Data Migration: Migrate existing company names into companies table
INSERT INTO public.companies (name, slug, description, industry, location, website_url, featured)
SELECT DISTINCT 
  company, 
  public.slugify(company),
  'Professional profile for ' || company || '.',
  'Technology',
  location,
  'https://www.' || public.slugify(company) || '.com',
  false
FROM public.jobs
ON CONFLICT (slug) DO NOTHING;

-- Link existing jobs to the new companies table
UPDATE public.jobs j
SET company_id = c.id
FROM public.companies c
WHERE j.company = c.name AND j.company_id IS NULL;

-- Generate slugs for existing jobs
UPDATE public.jobs
SET slug = public.slugify(title || '-' || company || '-' || substring(id::text, 1, 4))
WHERE slug IS NULL;

-- Setup touch_updated_at triggers for new tables
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_articles_updated BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS & Permissions for companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read companies" ON public.companies 
  FOR SELECT USING (true);

CREATE POLICY "Admins insert companies" ON public.companies 
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update companies" ON public.companies 
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete companies" ON public.companies 
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.companies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;

-- RLS & Permissions for articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read articles" ON public.articles 
  FOR SELECT USING (true);

CREATE POLICY "Admins insert articles" ON public.articles 
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update articles" ON public.articles 
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete articles" ON public.articles 
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;

-- Create Storage Buckets for logos and blog-images if not exist
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT DO NOTHING;

-- Storage policies for logos bucket
CREATE POLICY "Public read logos" ON storage.objects 
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Admins upload logos" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update logos" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete logos" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for blog-images bucket
CREATE POLICY "Public read blog-images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Admins upload blog-images" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update blog-images" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete blog-images" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));
