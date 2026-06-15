-- CLIENTES
INSERT INTO "Clientes" (nome, telefone, email, cidade, endereco) VALUES
('João Silva', '11999999999', 'joao@gmail.com', 'São Paulo', 'Rua A, 123'),
('Maria Souza', '11988888888', 'maria@gmail.com', 'São Paulo', 'Rua B, 45'),
('Carlos Pereira', '11977777777', 'carlos@gmail.com', 'Guarulhos', 'Av. Central, 90'),
('Fernanda Lima', '11966666666', 'fernanda@gmail.com', 'Osasco', 'Rua Flores, 10'),
('Ricardo Gomes', '11955555555', 'ricardo@gmail.com', 'São Paulo', 'Rua Azul, 200');

-- PRODUTOS
INSERT INTO "Produtos" (nome, descricao, preco, estoque) VALUES
('Fonte ATX 500W', 'Fonte de alimentação para PC', 199.90, 10),
('HD 1TB', 'HD SATA 1TB', 259.90, 15),
('SSD 240GB', 'SSD SATA 240GB', 149.90, 20),
('Memória RAM 8GB DDR4', 'Pente de memória 8GB DDR4 2400Mhz', 129.90, 30),
('Placa Mãe H310', 'Placa mãe para Intel 8/9gen', 399.90, 5);

-- ORDENS DE SERVIÇO
INSERT INTO "OrdensServico" (cliente_id, equipamento, defeito, status, valor_total) VALUES
(1, 'Notebook Dell', 'Não liga', 'Aberta', 350.00),
(2, 'PC Gamer', 'Troca de fonte', 'Finalizada', 250.00),
(3, 'Notebook Acer', 'Lento e travando', 'Aberta', 150.00);

-- ITENS DA ORDEM
INSERT INTO "OrdemItens" (ordem_id, produto_id, quantidade, preco_unit) VALUES
(1, 3, 1, 149.90),
(1, 4, 1, 129.90),
(2, 1, 1, 199.90),
(3, 5, 1, 399.90);

-- CONTAS A PAGAR
INSERT INTO "ContasPagar" (descricao, valor, vencimento, status) VALUES
('Pagamento Aluguel', 1200.00, '2025-11-20', 'Pendente'),
('Energia Elétrica', 350.00, '2025-11-18', 'Pago'),
('Internet Fibra', 150.00, '2025-11-25', 'Pendente');

-- CONTAS A RECEBER
INSERT INTO "ContasReceber" (cliente_id, descricao, valor, vencimento, status) VALUES
(1, 'Conserto Notebook Dell', 350.00, '2025-11-21', 'Pendente'),
(2, 'Troca de Fonte – PC Gamer', 250.00, '2025-11-15', 'Pago'),
(3, 'Revisão Notebook Acer', 150.00, '2025-11-30', 'Pendente');
