
-- Create a storage bucket for meme images
INSERT INTO storage.buckets (id, name, public)
VALUES ('memes', 'memes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read meme images
CREATE POLICY "Anyone can view memes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'memes');

-- Allow authenticated users to upload memes (admin use)
CREATE POLICY "Authenticated users can upload memes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'memes');
