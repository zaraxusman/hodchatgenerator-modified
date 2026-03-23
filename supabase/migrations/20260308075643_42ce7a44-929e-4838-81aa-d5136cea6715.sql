
-- Published chats table for the meme library
CREATE TABLE public.published_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Chat',
  chat_type text NOT NULL,
  config jsonb NOT NULL,
  category text NOT NULL DEFAULT 'random',
  likes_count integer NOT NULL DEFAULT 0,
  views_count integer NOT NULL DEFAULT 0,
  shares_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Chat likes table for unique likes
CREATE TABLE public.chat_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES public.published_chats(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (chat_id, user_id)
);

-- Enable RLS
ALTER TABLE public.published_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_likes ENABLE ROW LEVEL SECURITY;

-- Published chats: anyone can view published chats
CREATE POLICY "Anyone can view published chats" ON public.published_chats
  FOR SELECT USING (status = 'published');

-- Published chats: authenticated users can insert their own
CREATE POLICY "Users can publish their own chats" ON public.published_chats
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Published chats: users can update their own
CREATE POLICY "Users can update their own published chats" ON public.published_chats
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Published chats: users can delete their own
CREATE POLICY "Users can delete their own published chats" ON public.published_chats
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Chat likes: anyone can view likes
CREATE POLICY "Anyone can view likes" ON public.chat_likes
  FOR SELECT USING (true);

-- Chat likes: authenticated users can insert their own likes
CREATE POLICY "Users can like chats" ON public.chat_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Chat likes: users can remove their own likes
CREATE POLICY "Users can unlike chats" ON public.chat_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_published_chats_updated_at
  BEFORE UPDATE ON public.published_chats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment view count (security definer to bypass RLS for anonymous views)
CREATE OR REPLACE FUNCTION public.increment_chat_views(chat_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.published_chats SET views_count = views_count + 1 WHERE id = chat_id AND status = 'published';
$$;

-- Function to increment shares count
CREATE OR REPLACE FUNCTION public.increment_chat_shares(chat_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.published_chats SET shares_count = shares_count + 1 WHERE id = chat_id AND status = 'published';
$$;

-- Function to update likes count when a like is added/removed
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.published_chats SET likes_count = likes_count + 1 WHERE id = NEW.chat_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.published_chats SET likes_count = likes_count - 1 WHERE id = OLD.chat_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_likes_count_trigger
  AFTER INSERT OR DELETE ON public.chat_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();
