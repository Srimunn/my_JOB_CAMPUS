-- Migration: 20260619000002_user_auth_and_permissions.sql
-- Description: Sets up admin authentications, table RLS policies, and storage policies matching exactly the prompt guidelines.

-- 1. Ensure blogs and career_guidance tables exist (even if code currently queries articles)
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.career_guidance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS on all required tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 3. Drop all existing RLS policies on these tables to avoid duplication/conflicts
DROP POLICY IF EXISTS "Public read companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated insert companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated update companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated delete companies" ON public.companies;
DROP POLICY IF EXISTS "Admins insert companies" ON public.companies;
DROP POLICY IF EXISTS "Admins update companies" ON public.companies;
DROP POLICY IF EXISTS "Admins delete companies" ON public.companies;

DROP POLICY IF EXISTS "Public read jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated delete jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins delete jobs" ON public.jobs;

DROP POLICY IF EXISTS "Public read blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated delete blogs" ON public.blogs;

DROP POLICY IF EXISTS "Public read career_guidance" ON public.career_guidance;
DROP POLICY IF EXISTS "Authenticated insert career_guidance" ON public.career_guidance;
DROP POLICY IF EXISTS "Authenticated update career_guidance" ON public.career_guidance;
DROP POLICY IF EXISTS "Authenticated delete career_guidance" ON public.career_guidance;

DROP POLICY IF EXISTS "Public read applications" ON public.applications;
DROP POLICY IF EXISTS "Authenticated insert applications" ON public.applications;
DROP POLICY IF EXISTS "Authenticated update applications" ON public.applications;
DROP POLICY IF EXISTS "Authenticated delete applications" ON public.applications;
DROP POLICY IF EXISTS "Users see own applications" ON public.applications;
DROP POLICY IF EXISTS "Users create own applications" ON public.applications;
DROP POLICY IF EXISTS "Admins see all applications" ON public.applications;

DROP POLICY IF EXISTS "Public read articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated insert articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated update articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated delete articles" ON public.articles;
DROP POLICY IF EXISTS "Admins insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admins update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins delete articles" ON public.articles;

-- 4. Create SELECT (public read) policies
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public read career_guidance" ON public.career_guidance FOR SELECT USING (true);
CREATE POLICY "Public read applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);

-- 5. Create INSERT, UPDATE, DELETE policies checking auth.role() = 'authenticated'
-- companies
CREATE POLICY "Authenticated insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update companies" ON public.companies FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete companies" ON public.companies FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- jobs
CREATE POLICY "Authenticated insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update jobs" ON public.jobs FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete jobs" ON public.jobs FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- blogs
CREATE POLICY "Authenticated insert blogs" ON public.blogs FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update blogs" ON public.blogs FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete blogs" ON public.blogs FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- career_guidance
CREATE POLICY "Authenticated insert career_guidance" ON public.career_guidance FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update career_guidance" ON public.career_guidance FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete career_guidance" ON public.career_guidance FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- applications
CREATE POLICY "Authenticated insert applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update applications" ON public.applications FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete applications" ON public.applications FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- articles (career guidance / blogs)
CREATE POLICY "Authenticated insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update articles" ON public.articles FOR UPDATE TO authenticated USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete articles" ON public.articles FOR DELETE TO authenticated USING (auth.role() = 'authenticated');


-- 6. Ensure required storage buckets exist
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('company-logos', 'company-logos', true, 5242880) ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('blog-images', 'blog-images', true, 5242880) ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('job-images', 'job-images', true, 5242880) ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('logos', 'logos', true, 5242880) ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. Drop existing storage policies
DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins update logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete logos" ON storage.objects;

DROP POLICY IF EXISTS "Public read blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete blog-images" ON storage.objects;

DROP POLICY IF EXISTS "Public read company-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload company-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update company-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete company-logos" ON storage.objects;

DROP POLICY IF EXISTS "Public read job-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload job-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update job-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete job-images" ON storage.objects;

-- 8. Create Storage SELECT policies (public read)
CREATE POLICY "Public read logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Public read company-logos" ON storage.objects FOR SELECT USING (bucket_id = 'company-logos');
CREATE POLICY "Public read blog-images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Public read job-images" ON storage.objects FOR SELECT USING (bucket_id = 'job-images');

-- 9. Create Storage INSERT, UPDATE, DELETE policies checking auth.role() = 'authenticated'
-- logos
CREATE POLICY "Authenticated upload logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated update logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- company-logos
CREATE POLICY "Authenticated upload company-logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated update company-logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete company-logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

-- blog-images
CREATE POLICY "Authenticated upload blog-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated update blog-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete blog-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- job-images
CREATE POLICY "Authenticated upload job-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'job-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated update job-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'job-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete job-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'job-images' AND auth.role() = 'authenticated');
