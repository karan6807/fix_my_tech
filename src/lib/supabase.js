// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mhxxqbblsgdpctmtkfrn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeHhxYmJsc2dkcGN0bXRrZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzEzNDksImV4cCI6MjA3MDIwNzM0OX0.J99V7q6igN3Y_GlTaEeqJbWm40m4smIuD5k2KFbZNo0'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeHhxYmJsc2dkcGN0bXRrZnJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYzMTM0OSwiZXhwIjoyMDcwMjA3MzQ5fQ.ktjGPkOs93ih_B6tHwvlQVQSbBNxsTkrjiNed0-riOE'

// Client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for backend operations (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)