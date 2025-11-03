
ALTER TABLE public.prontuarios 
ADD COLUMN IF NOT EXISTS aluno_parceiro_nome TEXT,
ADD COLUMN IF NOT EXISTS supervisor_nome TEXT;


CREATE INDEX IF NOT EXISTS idx_prontuarios_aluno_parceiro_nome 
ON public.prontuarios (aluno_parceiro_nome);

CREATE INDEX IF NOT EXISTS idx_prontuarios_supervisor_nome 
ON public.prontuarios (supervisor_nome);



CREATE TABLE IF NOT EXISTS public.notificacoes_prontuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prontuario_id UUID NOT NULL REFERENCES public.prontuarios(id) ON DELETE CASCADE,
    destinatario_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
    tipo_notificacao TEXT NOT NULL DEFAULT 'novo_prontuario', -- 'novo_prontuario', 'atualizacao_prontuario'
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE INDEX IF NOT EXISTS idx_notificacoes_destinatario 
ON public.notificacoes_prontuarios (destinatario_id);

CREATE INDEX IF NOT EXISTS idx_notificacoes_prontuario 
ON public.notificacoes_prontuarios (prontuario_id);

CREATE INDEX IF NOT EXISTS idx_notificacoes_lida 
ON public.notificacoes_prontuarios (lida);

CREATE INDEX IF NOT EXISTS idx_notificacoes_created_at 
ON public.notificacoes_prontuarios (created_at);



CREATE OR REPLACE FUNCTION public.criar_notificacoes_prontuario()
RETURNS TRIGGER AS $$
BEGIN
    
    INSERT INTO public.notificacoes_prontuarios (prontuario_id, destinatario_id, tipo_notificacao)
    SELECT 
        NEW.id,
        p.id,
        'novo_prontuario'
    FROM public.perfis p
    WHERE p.funcao = 'coordenador' 
    AND p.especialidade_id = (SELECT especialidade_id FROM public.perfis WHERE id = NEW.aluno_id);
    
   
    INSERT INTO public.notificacoes_prontuarios (prontuario_id, destinatario_id, tipo_notificacao)
    SELECT 
        NEW.id,
        p.id,
        'novo_prontuario'
    FROM public.perfis p
    WHERE p.funcao = 'professor' 
    AND p.especialidade_id = (SELECT especialidade_id FROM public.perfis WHERE id = NEW.aluno_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



DROP TRIGGER IF EXISTS trigger_criar_notificacoes_prontuario ON public.prontuarios;

CREATE TRIGGER trigger_criar_notificacoes_prontuario
    AFTER INSERT ON public.prontuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.criar_notificacoes_prontuario();


CREATE OR REPLACE FUNCTION public.marcar_notificacao_lida(notificacao_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.notificacoes_prontuarios 
    SET lida = TRUE, updated_at = NOW()
    WHERE id = notificacao_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.buscar_notificacoes_usuario(usuario_id UUID, limite INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    prontuario_id UUID,
    tipo_notificacao TEXT,
    lida BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    titulo_prontuario TEXT,
    nome_paciente TEXT,
    nome_aluno TEXT,
    aluno_parceiro_nome TEXT,
    supervisor_nome TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.prontuario_id,
        n.tipo_notificacao,
        n.lida,
        n.created_at,
        p.titulo,
        pac.nome_completo,
        al.nome_completo,
        p.aluno_parceiro_nome,
        p.supervisor_nome
    FROM public.notificacoes_prontuarios n
    JOIN public.prontuarios p ON n.prontuario_id = p.id
    JOIN public.perfis pac ON p.paciente_id = pac.id
    JOIN public.perfis al ON p.aluno_id = al.id
    WHERE n.destinatario_id = usuario_id
    ORDER BY n.created_at DESC
    LIMIT limite;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE VIEW public.vw_prontuarios_completos AS
SELECT 
    p.id,
    p.titulo,
    p.conteudo,
    p.duracao_procedimento,
    p.aluno_parceiro_nome,
    p.supervisor_nome,
    p.created_at,
    p.paciente_id,
    p.aluno_id,
    pac.nome_completo AS nome_paciente,
    al.nome_completo AS nome_aluno,
    al.especialidade_id
FROM public.prontuarios p
JOIN public.perfis pac ON p.paciente_id = pac.id
JOIN public.perfis al ON p.aluno_id = al.id;



 ALTER TABLE public.prontuarios ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.notificacoes_prontuarios ENABLE ROW LEVEL SECURITY;

 Política para prontuários: usuários só veem prontuários da sua especialidade
 CREATE POLICY "Usuários veem prontuários da sua especialidade" ON public.prontuarios
 FOR SELECT USING (
     EXISTS (
         SELECT 1 FROM public.perfis p 
         WHERE p.id = auth.uid() 
         AND p.especialidade_id = (
             SELECT especialidade_id FROM public.perfis 
             WHERE id = prontuarios.aluno_id
        )
     )
 );

Política para notificações: usuários só veem suas próprias notificações
 CREATE POLICY "Usuários veem suas próprias notificações" ON public.notificacoes_prontuarios
 FOR SELECT USING (destinatario_id = auth.uid());
