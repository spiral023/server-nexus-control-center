// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ugpnlkxdnqmuoatdopfe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncG5sa3hkbnFtdW9hdGRvcGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NzI2MTMsImV4cCI6MjA2MzQ0ODYxM30.lEqa1PT2XK-SrLRWfdvcDFKe_iU6lonmmJqXI_lu4bw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);