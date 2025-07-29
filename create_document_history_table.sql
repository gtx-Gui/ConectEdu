-- Script para criar a tabela document_history no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela document_history
CREATE TABLE IF NOT EXISTS document_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    form_data JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_document_history_user_id ON document_history(user_id);
CREATE INDEX IF NOT EXISTS idx_document_history_generated_at ON document_history(generated_at);

-- Adicionar comentários para documentação
COMMENT ON TABLE document_history IS 'Tabela para armazenar histórico de documentos gerados pelos usuários';
COMMENT ON COLUMN document_history.user_id IS 'ID do usuário que gerou o documento';
COMMENT ON COLUMN document_history.document_type IS 'Tipo do documento (termo, declaracao, recibo1, recibo2)';
COMMENT ON COLUMN document_history.form_data IS 'Dados do formulário em formato JSON';
COMMENT ON COLUMN document_history.generated_at IS 'Data e hora de geração do documento';

-- Configurar RLS (Row Level Security) se necessário
-- ALTER TABLE document_history ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios documentos
-- CREATE POLICY "Users can view own document history" ON document_history
--     FOR SELECT USING (auth.uid()::text = user_id::text);

-- Política para usuários inserirem seus próprios documentos
-- CREATE POLICY "Users can insert own document history" ON document_history
--     FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);