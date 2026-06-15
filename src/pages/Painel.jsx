import React, { useState, useEffect } from "react";

export default function Painel() {
  // === Produtos ===
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [editId, setEditId] = useState(null);

  // === Ordem de Serviço ===
  const [cliente, setCliente] = useState("");
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [produtoBusca, setProdutoBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  // ------------------------
  // Produtos: listar do backend
  const listarProdutos = () => {
    fetch(`http://localhost:3001/api/produtos?busca=${busca}`)
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch(console.error);
  };
  useEffect(listarProdutos, [busca]);

  // Produtos: salvar ou atualizar
  const salvarProduto = () => {
    if (!nome || !descricao || !preco || !estoque) return alert("Preencha todos os campos");
    const payload = { nome, descricao, preco: Number(preco), estoque: Number(estoque) };
    const url = editId ? `http://localhost:3001/api/produtos/${editId}` : "http://localhost:3001/api/produtos";
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar produto");
        return res.json();
      })
      .then(() => {
        listarProdutos();
        limparFormularioProduto();
      })
      .catch((err) => alert(err.message));
  };

  const limparFormularioProduto = () => {
    setNome(""); setDescricao(""); setPreco(""); setEstoque(""); setEditId(null);
  };

  const editarProduto = (produto) => {
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setEstoque(produto.estoque);
    setEditId(produto.id);
  };

  const removerProduto = (id) => {
    if (!window.confirm("Deseja realmente remover este produto?")) return;
    fetch(`http://localhost:3001/api/produtos/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao remover produto");
        listarProdutos();
      })
      .catch((err) => alert(err.message));
  };

  // ------------------------
  // Ordem de Serviço: busca produtos para adicionar
  useEffect(() => {
    if (!produtoBusca) {
      setProdutosFiltrados([]);
      return;
    }
    fetch(`http://localhost:3001/api/produtos?busca=${produtoBusca}`)
      .then((res) => res.json())
      .then((data) => setProdutosFiltrados(data))
      .catch(console.error);
  }, [produtoBusca]);

  const adicionarItem = (produto) => {
    setItens((prev) => {
      const existe = prev.find((i) => i.id === produto.id);
      if (existe) return prev.map((i) => i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      return [...prev, { ...produto, quantidade: 1 }];
    });
    setProdutoBusca("");
  };

  const removerItem = (index) => setItens((prev) => prev.filter((_, i) => i !== index));
  const alterarQuantidade = (index, quantidade) => setItens((prev) =>
    prev.map((i, idx) => idx === index ? { ...i, quantidade: Number(quantidade) } : i)
  );

  useEffect(() => {
    const novoTotal = itens.reduce((acc, i) => acc + i.quantidade * Number(i.preco), 0);
    setTotal(novoTotal);
  }, [itens]);

  const salvarOrdem = () => {
    if (!cliente || itens.length === 0) return alert("Preencha cliente e adicione produtos");
    const payload = { cliente, itens: itens.map(i => ({ id: i.id, nome: i.nome, quantidade: i.quantidade, preco: Number(i.preco) })), total };
    fetch("http://localhost:3001/api/ordens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => { if (!res.ok) throw new Error("Erro ao salvar ordem"); return res.json(); })
      .then(() => { alert("Ordem salva com sucesso"); setCliente(""); setItens([]); })
      .catch((err) => alert(err.message));
  };

  // ------------------------
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Painel Administrativo</h1>

      {/* ===== Produtos ===== */}
      <section style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h2>Produtos</h2>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <input type="number" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
        <input type="number" placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />
        <button onClick={salvarProduto}>{editId ? "Atualizar" : "Salvar"}</button>
        {editId && <button onClick={limparFormularioProduto}>Cancelar</button>}

        <input placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} style={{ marginTop: "10px", width: "100%" }} />
        <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nome</th><th>Descrição</th><th>Preço</th><th>Estoque</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.descricao}</td>
                <td>R$ {Number(p.preco).toFixed(2)}</td>
                <td>{p.estoque}</td>
                <td>
                  <button onClick={() => editarProduto(p)}>Editar</button>
                  <button onClick={() => removerProduto(p.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ===== Ordem de Serviço ===== */}
      <section style={{ border: "1px solid #ccc", padding: "10px" }}>
        <h2>Ordem de Serviço</h2>
        <input placeholder="Cliente" value={cliente} onChange={e => setCliente(e.target.value)} style={{ width: "100%", marginBottom: "5px" }} />
        <input placeholder="Buscar produto..." value={produtoBusca} onChange={e => setProdutoBusca(e.target.value)} style={{ width: "100%", marginBottom: "5px" }} />
        {produtoBusca && produtosFiltrados.length > 0 && (
          <ul style={{ border: "1px solid #ccc", padding: 0, margin: 0 }}>
            {produtosFiltrados.map(p => (
              <li key={p.id} onClick={() => adicionarItem(p)} style={{ listStyle: "none", padding: "5px", cursor: "pointer" }}>
                {p.nome} - R$ {Number(p.preco).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
        <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Produto</th><th>Qtd</th><th>Preço Unit</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((i, idx) => (
              <tr key={idx}>
                <td>{i.nome}</td>
                <td><input type="number" min="1" value={i.quantidade} onChange={e => alterarQuantidade(idx, e.target.value)} style={{ width: "60px" }} /></td>
                <td>R$ {Number(i.preco).toFixed(2)}</td>
                <td><button onClick={() => removerItem(idx)}>Remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total: R$ {total.toFixed(2)}</h3>
        <button onClick={salvarOrdem}>Salvar Ordem</button>
      </section>
    </div>
  );
}
