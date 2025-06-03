import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlehoxkfbdrosttbkkud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZWhveGtmYmRyb3N0dGJra3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTI1MTIsImV4cCI6MjA2MTc2ODUxMn0.2_Ssf9SZT7_8-Yq1gSf8GFmfWXaKpesaMVj0aqzu5Xs'; // Substitua pela sua anon key do painel do Supabase

export const supabase = createClient(supabaseUrl, supabaseKey); 