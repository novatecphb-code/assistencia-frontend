import React, { useEffect, useState } from "react";

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    cliente_id: "",
    equipamento: "",
    defeito: "",
    status: "Em andamento",
    itens: [],
    valor_total: 0,
    previsao: "",
  });

  // ------------------------------
  // CARREGAR DADOS INICIAIS
  // ------------------------------
  useEffect(() => {
    carregarOrdens();
    carregarClientes();
    carregarProdutos();
  }, []);

  function carregarOrdens() {
    fetch("http://localhost:3001/api/ordens")
      .then((res) => res.json())
      .then((data) => setOrdens(data));
  }

  function carregarClientes() {
    fetch("http://localhost:3001/api/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }

  function carregarProdutos() {
    fetch("http://localhost:3001/api/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }

  // ------------------------------
  // MODAL (abrir/fechar)
  // ------------------------------
  async function abrirModal(ordem = null) {
    setEditando(ordem);

    if (ordem) {
      const resp = await fetch(`http://localhost:3001/api/ordens/${ordem.id}`);
      const dados = await resp.json();

      setForm({
        cliente_id: dados.cliente_id || "",
        equipamento: dados.equipamento || "",
        defeito: dados.defeito || "",
        status: dados.status || "Em andamento",
        previsao: dados.previsao || "",
        valor_total: dados.valor_total || 0,
        itens: dados.itens
          ? dados.itens.map((i) => ({
              id: i.produto_id,
              nome: i.produto_nome,
              preco: Number(i.produto_preco),
              quantidade: i.quantidade,
            }))
          : [],
      });
    } else {
      // NOVA ORDEM
      setForm({
        cliente_id: "",
        equipamento: "",
        defeito: "",
        status: "Em andamento",
        itens: [],
        valor_total: 0,
        previsao: "",
      });
    }

    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
    setEditando(null);
  }

  // ------------------------------
  // ITENS
  // ------------------------------
  function adicionarItem(produto) {
    setForm((prev) => ({
      ...prev,
      itens: [...prev.itens, { ...produto, quantidade: 1 }],
    }));
  }

  function removerItem(index) {
    setForm((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }));
  }

  function alterarQuantidade(index, quantidade) {
    setForm((prev) => ({
      ...prev,
      itens: prev.itens.map((item, i) =>
        i === index ? { ...item, quantidade: Number(quantidade) } : item
      ),
    }));
  }

  // Atualizar total automaticamente
  useEffect(() => {
    const total = form.itens.reduce(
      (acc, item) => acc + item.quantidade * Number(item.preco),
      0
    );
    setForm((prev) => ({ ...prev, valor_total: total }));
  }, [form.itens]);

  // ------------------------------
  // SALVAR ORDEM
  // ------------------------------
  function salvarOrdem() {
    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:3001/api/ordens/${editando.id}`
      : "http://localhost:3001/api/ordens";

    const body = {
      ...form,
      itens: form.itens.map((i) => ({
        produto_id: i.id,
        quantidade: i.quantidade,
      })),
    };

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then(() => {
        carregarOrdens();
        fecharModal();
      })
      .catch((err) => console.error(err));
  }

  // ------------------------------
  // EXCLUIR ORDEM
  // ------------------------------
  function excluirOrdem(id) {
    if (!confirm("Deseja excluir esta ordem?")) return;

    fetch(`http://localhost:3001/api/ordens/${id}`, {
      method: "DELETE",
    })
      .then(() => carregarOrdens())
      .catch((err) => console.error(err));
  }

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ordens de Serviço</h1>

      <button
        onClick={() => abrirModal()}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6 hover:bg-green-700 transition"
      >
        Nova Ordem
      </button>

      {/* LISTA DE ORDENS */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Ordens Existentes</h2>

        {ordens.length === 0 ? (
          <p>Nenhuma ordem encontrada</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Cliente</th>
                <th className="border p-2">Equipamento</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Valor</th>
                <th className="border p-2">Ações</th>
              </tr>
            </thead>

            <tbody>
              {ordens.map((o) => (
                <tr key={o.id} className="bg-white">
                  <td className="border p-2">{o.id}</td>
                  <td className="border p-2">{o.cliente_nome}</td>
                  <td className="border p-2">{o.equipamento}</td>
                  <td className="border p-2">{o.status}</td>
                  <td className="border p-2">R$ {Number(o.valor_total).toFixed(2)}</td>

                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => abrirModal(o)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirOrdem(o.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-bold mb-4">
              {editando ? "Editar Ordem" : "Nova Ordem"}
            </h2>

            <select
              className="border p-2 w-full mb-2"
              value={form.cliente_id}
              onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
            >
              <option value="">Selecione o cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Equipamento"
              value={form.equipamento}
              onChange={(e) =>
                setForm({ ...form, equipamento: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Defeito"
              value={form.defeito}
              onChange={(e) => setForm({ ...form, defeito: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />

            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={form.previsao}
              onChange={(e) => setForm({ ...form, previsao: e.target.value })}
            />

            {/* ITENS */}
            <h3 className="font-semibold mt-2 mb-1">Itens</h3>

            <div className="mb-2 flex flex-col gap-1 max-h-40 overflow-auto border p-2 rounded">
              {form.itens.map((item, index) => (
                <div key={index} className="flex justify-between items-center gap-2">
                  <span>
                    {item.nome} (R$ {Number(item.preco).toFixed(2)})
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => alterarQuantidade(index, e.target.value)}
                    className="border p-1 w-16"
                  />

                  <button
                    onClick={() => removerItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <select
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const produto = produtos.find(
                  (p) => p.id === Number(e.target.value)
                );
                if (produto) adicionarItem(produto);
              }}
              value=""
            >
              <option value="">Adicionar produto...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} - R$ {Number(p.preco).toFixed(2)}
                </option>
              ))}
            </select>

            <p className="mt-2 font-semibold">
              Total: R$ {Number(form.valor_total).toFixed(2)}
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={fecharModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>

              <button
                onClick={salvarOrdem}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
