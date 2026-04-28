import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbmshpgsitkinxyhwuoi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndibXNocGdzaXRraW54eWh3dW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDY1OTUsImV4cCI6MjA5Mjc4MjU5NX0.2elsLMPUE8ABuQC5FvGdTQHqMsa29-XAG8VECesa3-0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)