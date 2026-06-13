-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.visitors (
  id TEXT PRIMARY KEY,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  page_views INTEGER DEFAULT 1 NOT NULL,
  country TEXT DEFAULT 'Unknown'::text NOT NULL,
  device TEXT DEFAULT 'Unknown'::text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.analytics (
  id TEXT PRIMARY KEY,
  total_visitors INTEGER DEFAULT 0 NOT NULL,
  total_page_views INTEGER DEFAULT 0 NOT NULL
);

-- Seed the initial analytics document (if it doesn't already exist)
INSERT INTO public.analytics (id, total_visitors, total_page_views)
VALUES ('stats', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable Supabase Realtime for both tables
-- Standard Supabase projects have a publication named 'supabase_realtime'
-- We query the pg_publication_rel catalog to add tables only if they are not already members.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    WHERE p.pubname = 'supabase_realtime' AND c.relname = 'visitors'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.visitors;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    WHERE p.pubname = 'supabase_realtime' AND c.relname = 'analytics'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics;
  END IF;
END $$;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Allow public select (read access) so visitors can view total stats and online counts
-- Drop policies first if they exist to prevent duplication errors on re-runs
DROP POLICY IF EXISTS "Allow public read analytics" ON public.analytics;
CREATE POLICY "Allow public read analytics" ON public.analytics
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public read visitors" ON public.visitors;
CREATE POLICY "Allow public read visitors" ON public.visitors
  FOR SELECT TO public USING (true);

-- We do NOT create direct INSERT/UPDATE policies for the public client.
-- Instead, all changes will be routed through the SECURITY DEFINER function below.
-- This prevents users from writing random visitor IDs, editing others' data, or resetting stats.

-- 5. Create Secure RPC function for visitor tracking and heartbeats
CREATE OR REPLACE FUNCTION public.track_visit(
  p_visitor_id TEXT,
  p_country TEXT,
  p_device TEXT,
  p_is_new_session BOOLEAN
) RETURNS VOID AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Ensure global analytics row is initialized
  INSERT INTO public.analytics (id, total_visitors, total_page_views)
  VALUES ('stats', 0, 0)
  ON CONFLICT (id) DO NOTHING;

  -- Check if visitor exists
  SELECT EXISTS(SELECT 1 FROM public.visitors WHERE id = p_visitor_id) INTO v_exists;

  IF NOT v_exists THEN
    -- Insert new unique visitor
    INSERT INTO public.visitors (id, first_seen, last_seen, page_views, country, device)
    VALUES (p_visitor_id, now(), now(), 1, COALESCE(p_country, 'Unknown'), COALESCE(p_device, 'Unknown'));
    
    -- Increment both total unique visitors and total page views
    UPDATE public.analytics
    SET total_visitors = total_visitors + 1,
        total_page_views = total_page_views + 1
    WHERE id = 'stats';
  ELSE
    -- Visitor exists
    IF p_is_new_session THEN
      -- New session: update heartbeat and increment page_views
      UPDATE public.visitors
      SET last_seen = now(),
          page_views = page_views + 1,
          country = CASE WHEN p_country IS NOT NULL AND p_country <> 'Unknown' THEN p_country ELSE country END,
          device = CASE WHEN p_device IS NOT NULL AND p_device <> 'Unknown' THEN p_device ELSE device END
      WHERE id = p_visitor_id;
      
      -- Increment total page views
      UPDATE public.analytics
      SET total_page_views = total_page_views + 1
      WHERE id = 'stats';
    ELSE
      -- Heartbeat: just update last_seen activity timestamp
      UPDATE public.visitors
      SET last_seen = now()
      WHERE id = p_visitor_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant execute permissions on RPC function to anonymous public client
GRANT EXECUTE ON FUNCTION public.track_visit(TEXT, TEXT, TEXT, BOOLEAN) TO anon;
