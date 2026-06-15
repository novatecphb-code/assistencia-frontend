import React, { useEffect, useState } from "react";

export default function Financeiro() {
  const [movimentos, setMovimentos] = useState([]);
  const [tipoSelecionado, setTipoSelecionado] = useState("receber"); // "receber" ou "pagar"
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    descricao: "",
    valor: 0,
    vencimento: "",
    status: "Pendente",
    tipo: "Receber", // Receber ou Pagar
  });

  useEffect(() => {
    carregarMovimentos();
  }, [tipoSelecionado]);

  function carregarMovimentos() {
    const url =
      tipoSelecionado === "receber"
        ? "http://localhost:3001/api/contas-receber"
        : "http://localhost:3001/api/contas-pagar";

    fetch(url)
      .then((res) => res.json())
      .then((data) => setMovimentos(data));
  }

  function abrirModal(movimento = null) {
    setEditando(movimento);
    setForm(
      movimento || {
        descricao: "",
        valor: 0,
        vencimento: "",
        status: "Pendente",
        tipo: tipoSelecionado === "receber" ? "Receber" : "Pagar",
      }
    );
    setModalOpen(true);
  }

  function fecharModal() {
    setEditando(null);
    setModalOpen(false);
  }

  function salvarMovimento() {
    const url =
      tipoSelecionado === "receber"
        ? editando
          ? `http://localhost:3001/api/contas-receber/${editando.id}`
          : "http://localhost:3001/api/contas-receber"
        : editando
        ? `http://localhost:3001/api/contas-pagar/${editando.id}`
        : "http://localhost:3001/api/contas-pagar";

    const metodo = editando ? "PUT" : "POST";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      carregarMovimentos();
      fecharModal();
    });
  }

  function excluirMovimento(id) {
    if (!confirm("Deseja excluir este registro?")) return;

    const url =
      tipoSelecionado === "receber"
        ? `http://localhost:3001/api/contas-receber/${id}`
        : `http://localhost:3001/api/contas-pagar/${id}`;

    fetch(url, { method: "DELETE" }).then(() => carregarMovimentos());
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold border-b pb-2 mb-4">Financeiro</h1>

      {/* Abas */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded transition ${
            tipoSelecionado === "receber"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTipoSelecionado("receber")}
        >
          Contas a Receber
        </button>
        <button
          className={`px-4 py-2 rounded transition ${
            tipoSelecionado === "pagar"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTipoSelecionado("pagar")}
        >
          Contas a Pagar
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => abrirModal()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Novo Registro
        </button>
        <button
          onClick={carregarMovimentos}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Recarregar
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {movimentos.map((m, index) => (
          <div
            key={m.id}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded shadow-sm ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } border border-gray-200 hover:shadow-md transition`}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 flex-1">
              <span className="font-semibold">ID: {m.id}</span>
              <span>Descrição: {m.descricao}</span>
              <span>Valor: R$ {Number(m.valor).toFixed(2)}</span>
              <span>Vencimento: {m.vencimento}</span>
              <span>Status: {m.status}</span>
            </div>
            <div className="mt-2 sm:mt-0 flex gap-2">
              <button
                onClick={() => abrirModal(m)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => excluirMovimento(m.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
        {movimentos.length === 0 && (
          <div className="text-center py-3 text-gray-500">Nenhum registro encontrado</div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {editando ? "Editar Registro" : "Novo Registro"}
            </h2>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <input
              type="number"
              className="border p-2 w-full mb-2"
              placeholder="Valor"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
            />
            <input
              type="date"
              className="border p-2 w-full mb-2"
              placeholder="Vencimento"
              value={form.vencimento}
              onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
            />
            <select
              className="border p-2 w-full mb-2"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {tipoSelecionado === "receber" ? (
                <>
                  <option value="Pendente">Pendente</option>
                  <option value="Recebido">Recebido</option>
                </>
              ) : (
                <>
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                </>
              )}
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={fecharModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvarMovimento}
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
