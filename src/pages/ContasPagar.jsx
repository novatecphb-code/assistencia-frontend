import React, { useEffect, useState } from "react";

export default function ContasPagar() {
  const [contas, setContas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    vencimento: "",
    status: "Pendente",
  });

  useEffect(() => {
    carregarContas();
  }, []);

  function carregarContas() {
    fetch("http://localhost:3001/api/contas-pagar")
      .then((res) => res.json())
      .then((data) => setContas(data));
  }

  function salvarConta() {
    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:3001/api/contas-pagar/${editando.id}`
      : `http://localhost:3001/api/contas-pagar`;

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      carregarContas();
      fecharModal();
    });
  }

  function excluirConta(id) {
    if (!confirm("Deseja excluir esta conta?")) return;

    fetch(`http://localhost:3001/api/contas-pagar/${id}`, {
      method: "DELETE",
    }).then(() => carregarContas());
  }

  function abrirModal(conta = null) {
    setEditando(conta);
    setForm(
      conta || {
        descricao: "",
        valor: "",
        vencimento: "",
        status: "Pendente",
      }
    );
    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
    setEditando(null);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contas a Pagar</h1>
      <button
  onClick={() => window.history.back()}
  className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
>
  ← Voltar
</button>

      <button
        onClick={() => abrirModal()}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6 hover:bg-green-700 transition"
      >
        Nova Conta
      </button>

      <div className="flex flex-col gap-4">
        {contas.map((c, index) => (
          <div
            key={c.id}
            className={`
              flex flex-col sm:flex-row justify-between items-start sm:items-center
              p-4 rounded shadow-sm
              ${index % 2 === 0 ? "bg-white" : "bg-blue-50"}
              border border-gray-200
              hover:shadow-md transition
            `}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 flex-1">
              <span className="font-semibold">ID: {c.id}</span>
              <span>Descrição: {c.descricao}</span>
              <span>Valor: R$ {c.valor}</span>
              <span>Vencimento: {c.vencimento}</span>
              <span>Status: {c.status}</span>
            </div>

            <div className="mt-2 sm:mt-0 flex gap-2">
              <button
                onClick={() => abrirModal(c)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => excluirConta(c.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {editando ? "Editar Conta" : "Nova Conta"}
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
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={fecharModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>

              <button
                onClick={salvarConta}
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
