-- Migration: 20260619000001_authenticated_policies.sql
-- Description: Create authenticated user policies for companies and storage upload, and public read for logos.

-- 1. Ensure RLS is enabled on companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing company policies to avoid conflicts
DROP POLICY IF EXISTS "Public read companies" ON public.companies;
DROP POLICY IF EXISTS "Admins insert companies" ON public.companies;
DROP POLICY IF EXISTS "Admins update companies" ON public.companies;
DROP POLICY IF EXISTS "Admins delete companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated select companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated insert companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated update companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated delete companies" ON public.companies;

-- 3. Create authenticated policies for companies (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Public read companies" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated insert companies" ON public.companies
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated update companies" ON public.companies
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated delete companies" ON public.companies
  FOR DELETE TO authenticated USING (true);

-- 4. Ensure logos bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('logos', 'logos', true, 5242880, ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Drop existing storage policies for logos bucket
DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins update logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete logos" ON storage.objects;

-- 6. Create storage policies for logos: public read, authenticated upload/update/delete
CREATE POLICY "Public read logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Authenticated upload logos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Authenticated update logos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'logos');

CREATE POLICY "Authenticated delete logos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'logos');
