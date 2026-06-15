import React, { useEffect, useState } from "react";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
  });

  useEffect(() => carregarProdutos(), []);

  function carregarProdutos() {
    fetch("http://localhost:3001/api/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }

  function salvarProduto() {
    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:3001/api/produtos/${editando.id}`
      : "http://localhost:3001/api/produtos";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        preco: Number(form.preco),
        estoque: Number(form.estoque),
      }),
    }).then(() => {
      carregarProdutos();
      fecharModal();
    });
  }

  function excluirProduto(id) {
    if (!confirm("Deseja excluir este produto?")) return;
    fetch(`http://localhost:3001/api/produtos/${id}`, { method: "DELETE" })
      .then(() => carregarProdutos());
  }

  function abrirModal(produto = null) {
    setEditando(produto);
    setForm(
      produto || { nome: "", descricao: "", preco: "", estoque: "" }
    );
    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
    setEditando(null);
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">Produtos</h1>

      <button
        onClick={() => abrirModal()}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700 transition"
      >
        Novo Produto
      </button>

      <div className="flex flex-col gap-2">
        {produtos.map((p, index) => (
          <div
            key={p.id}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center
                        p-4 rounded shadow-sm border border-gray-200 hover:shadow-md transition
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 flex-1">
              <span className="font-semibold">ID: {p.id}</span>
              <span>Nome: {p.nome}</span>
              <span>Descrição: {p.descricao}</span>
              <span>Preço: R$ {Number(p.preco).toFixed(2)}</span>
              <span>Estoque: {p.estoque}</span>
            </div>

            <div className="mt-2 sm:mt-0 flex gap-2">
              <button
                onClick={() => abrirModal(p)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => excluirProduto(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
        {produtos.length === 0 && (
          <div className="text-center p-4 text-gray-500 border border-gray-200 rounded">
            Nenhum produto cadastrado
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-96">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">
              {editando ? "Editar Produto" : "Novo Produto"}
            </h2>

            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <input
              type="number"
              className="border p-2 w-full mb-2 rounded"
              placeholder="Preço"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
            />
            <input
              type="number"
              className="border p-2 w-full mb-2 rounded"
              placeholder="Estoque"
              value={form.estoque}
              onChange={(e) => setForm({ ...form, estoque: e.target.value })}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={fecharModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvarProduto}
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
