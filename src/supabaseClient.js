// Este é o conteúdo do ficheiro: src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// As "credenciais" para conectar ao seu projeto Supabase.
// Vamos preenchê-las no próximo passo.
const supabaseUrl = 'https://kwdvvjioyeafiifcwowc.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ZHZ2amlveWVhZmlpZmN3b3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNDYxMjAsImV4cCI6MjA3MDYyMjEyMH0.6sftlcByDj7w3oa0JlZVJPTRLu6JoDwQ9gPn5pAiqlA';

// Aqui criamos e exportamos o "cliente", que é a nossa conexão reutilizável.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);