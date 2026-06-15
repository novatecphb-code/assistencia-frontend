-- =============================
-- ASSISTÊNCIA TÉCNICA PRO - SCHEMA COMPLETO
-- PostgreSQL - Versão Final
-- =============================

-- =============
-- TABELA: USUÁRIOS
-- =============
CREATE TABLE IF NOT EXISTS "Usuarios" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- =============
-- TABELA: CLIENTES
-- =============
CREATE TABLE IF NOT EXISTS "Clientes" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(120),
    cidade VARCHAR(100),
    endereco VARCHAR(200),
    criado_em TIMESTAMP DEFAULT NOW()
);

-- =============
-- TABELA: PRODUTOS
-- =============
CREATE TABLE IF NOT EXISTS "Produtos" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL DEFAULT 0,
    estoque INT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ==========================
-- TABELA: ORDENS DE SERVIÇO
-- ==========================
CREATE TABLE IF NOT EXISTS "OrdensServico" (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES "Clientes"(id) ON DELETE CASCADE,
    equipamento VARCHAR(120) NOT NULL,
    defeito TEXT,
    status VARCHAR(50) DEFAULT 'Aberta',
    valor_total NUMERIC(10,2) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- =============================
-- TABELA: ITENS DA ORDEM
-- =============================
CREATE TABLE IF NOT EXISTS "OrdemItens" (
    id SERIAL PRIMARY KEY,
    ordem_id INT NOT NULL REFERENCES "OrdensServico"(id) ON DELETE CASCADE,
    produto_id INT REFERENCES "Produtos"(id),
    quantidade INT NOT NULL DEFAULT 1,
    preco_unit NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) GENERATED ALWAYS AS (quantidade * preco_unit) STORED
);

-- ===========================
-- TABELA: CONTAS A PAGAR
-- ===========================
CREATE TABLE IF NOT EXISTS "ContasPagar" (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- TABELA: CONTAS A RECEBER
-- ===========================
CREATE TABLE IF NOT EXISTS "ContasReceber" (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES "Clientes"(id),
    descricao VARCHAR(200) NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT NOW()
);

-- =============================
-- INSERT DE ADMIN PADRÃO
-- =============================
INSERT INTO "Usuarios" (nome, email, senha)
VALUES ('Administrador', 'admin@sistema.com', '$2b$10$k1icwB1BxX1Vh3dJtMnj0OeDt3WgL1cY1kQeT5K9ZC0NniIafmQXu')
ON CONFLICT (email) DO NOTHING;

-- (senha do admin = admin123)
