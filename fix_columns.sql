-- =====================================================
-- SCRIPT SIMPLES PARA ADICIONAR AS NOVAS COLUNAS
-- Execute este primeiro para resolver o erro
-- =====================================================

-- Adicionar as novas colunas na tabela prontuarios
ALTER TABLE public.prontuarios 
ADD COLUMN IF NOT EXISTS aluno_parceiro_nome TEXT,
ADD COLUMN IF NOT EXISTS supervisor_nome TEXT;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'prontuarios' 
AND column_name IN ('aluno_parceiro_nome', 'supervisor_nome');

-- =====================================================
-- INSTRUÇÕES:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se as colunas foram criadas
-- 3. Depois execute o script completo database_setup.sql
-- =====================================================
