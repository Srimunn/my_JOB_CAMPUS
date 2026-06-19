-- Fix: Ensure has_role is executable by authenticated users for RLS policies
-- This is needed because a previous migration revoked PUBLIC execute on has_role,
-- which also stripped the authenticated role's inherited ability to call it.

-- Re-grant execute to authenticated (needed for all RLS policies using has_role)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- Ensure logos bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('logos', 'logos', true, 5242880, ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Ensure blog-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('blog-images', 'blog-images', true, 5242880, ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop and recreate storage policies for logos to avoid conflicts
DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins update logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete logos" ON storage.objects;

CREATE POLICY "Public read logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Admins upload logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

-- Drop and recreate storage policies for blog-images to avoid conflicts
DROP POLICY IF EXISTS "Public read blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete blog-images" ON storage.objects;

CREATE POLICY "Public read blog-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Admins upload blog-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update blog-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete blog-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

-- Drop and recreate companies table policies to ensure they are correct
DROP POLICY IF EXISTS "Admins insert companies" ON public.companies;
DROP POLICY IF EXISTS "Admins update companies" ON public.companies;
DROP POLICY IF EXISTS "Admins delete companies" ON public.companies;

CREATE POLICY "Admins insert companies" ON public.companies
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update companies" ON public.companies
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete companies" ON public.companies
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate articles table policies to ensure they are correct
DROP POLICY IF EXISTS "Admins insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admins update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins delete articles" ON public.articles;

CREATE POLICY "Admins insert articles" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update articles" ON public.articles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete articles" ON public.articles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
