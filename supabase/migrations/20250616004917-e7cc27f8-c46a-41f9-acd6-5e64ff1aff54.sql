
-- Enable RLS on existing tables and update policies for authenticated users
DROP POLICY IF EXISTS "Allow all operations on servers" ON public.servers;
DROP POLICY IF EXISTS "Allow all operations on server history" ON public.server_history;

-- Create policies that require authentication
CREATE POLICY "Authenticated users can view servers" ON public.servers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert servers" ON public.servers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update servers" ON public.servers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete servers" ON public.servers
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view server history" ON public.server_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert server history" ON public.server_history
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update server history" ON public.server_history
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete server history" ON public.server_history
  FOR DELETE TO authenticated USING (true);
