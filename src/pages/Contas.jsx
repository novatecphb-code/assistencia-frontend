import React, { useEffect, useState } from "react";

export default function Contas() {
  const [contasPagar, setContasPagar] = useState([]);
  const [contasReceber, setContasReceber] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [tipo, setTipo] = useState("pagar"); // "pagar" ou "receber"

  const [form, setForm] = useState({
    cliente_id: "",
    descricao: "",
    valor: 0,
    vencimento: "",
    status: "Pendente",
  });

  useEffect(() => {
    carregarContasPagar();
    carregarContasReceber();
    carregarClientes();
  }, []);

  function carregarContasPagar() {
    fetch("http://localhost:3001/api/contas-pagar")
      .then(res => res.json())
      .then(data => setContasPagar(data));
  }

  function carregarContasReceber() {
    fetch("http://localhost:3001/api/contas-receber")
      .then(res => res.json())
      .then(data => setContasReceber(data));
  }

  function carregarClientes() {
    fetch("http://localhost:3001/api/clientes")
      .then(res => res.json())
      .then(data => setClientes(data));
  }

  function abrirModal(conta = null, tipoConta = "pagar") {
    setTipo(tipoConta);
    setEditando(conta);
    setForm(
      conta || { cliente_id: "", descricao: "", valor: 0, vencimento: "", status: "Pendente" }
    );
    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
    setEditando(null);
  }

  function salvarConta() {
    const urlBase = tipo === "pagar" ? "contas-pagar" : "contas-receber";
    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:3001/api/${urlBase}/${editando.id}`
      : `http://localhost:3001/api/${urlBase}`;

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      tipo === "pagar" ? carregarContasPagar() : carregarContasReceber();
      fecharModal();
    });
  }

  function excluirConta(id) {
    if (!confirm("Deseja excluir esta conta?")) return;

    const urlBase = tipo === "pagar" ? "contas-pagar" : "contas-receber";
    fetch(`http://localhost:3001/api/${urlBase}/${id}`, { method: "DELETE" })
      .then(() => {
        tipo === "pagar" ? carregarContasPagar() : carregarContasReceber();
      });
  }

  const renderTabela = (contas, tipoConta) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2">
        {tipoConta === "pagar" ? "Contas a Pagar" : "Contas a Receber"}
      </h2>

      <button
        onClick={() => abrirModal(null, tipoConta)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-2"
      >
        Nova Conta
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Cliente</th>
            <th className="p-2 border">Descrição</th>
            <th className="p-2 border">Valor</th>
            <th className="p-2 border">Vencimento</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {contas.map((c, index) => (
            <tr
              key={c.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 transition`}
            >
              <td className="p-2 border">{c.id}</td>
              <td className="p-2 border">{clientes.find(cli => cli.id === c.cliente_id)?.nome || "—"}</td>
              <td className="p-2 border">{c.descricao}</td>
              <td className="p-2 border">R$ {c.valor}</td>
              <td className="p-2 border">{c.vencimento}</td>
              <td className="p-2 border">{c.status}</td>
              <td className="p-2 border">
                <button
                  onClick={() => abrirModal(c, tipoConta)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirConta(c.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Painel de Contas</h1>

      {renderTabela(contasPagar, "pagar")}
      {renderTabela(contasReceber, "receber")}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {editando ? "Editar Conta" : "Nova Conta"}
            </h2>

            <select
              className="border p-2 w-full mb-2"
              value={form.cliente_id}
              onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
            >
              <option value="">Selecione o cliente</option>
              {clientes.map(cli => (
                <option key={cli.id} value={cli.id}>{cli.nome}</option>
              ))}
            </select>

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
              <option value="Recebido">Recebido</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={fecharModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={salvarConta}
                className="bg-green-600 text-white px-4 py-2 rounded"
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
