import React, { useEffect, useState } from "react";
import api from "@/services/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", cidade: "" });

  useEffect(() => {
    carregarClientes();
  }, []);

  function carregarClientes() {
    api.get("/clientes")
      .then(r => setClientes(r.data))
      .catch(console.error);
  }

  function abrirModal(cliente = null) {
    setEditando(cliente);
    setForm(cliente || { nome: "", telefone: "", email: "", cidade: "" });
    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
    setEditando(null);
  }

  async function salvar() {
    try {
      if (editando) {
        await api.put(`/clientes/${editando.id}`, form);
      } else {
        await api.post(`/clientes`, form);
      }
      carregarClientes();
      fecharModal();
    } catch (e) {
      console.error(e);
    }
  }

  async function excluir(id) {
    if (!confirm("Deseja excluir este cliente?")) return;
    await api.delete(`/clientes/${id}`);
    carregarClientes();
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full max-w-4xl mx-auto">

      <h2 className="text-xl font-semibold border-b pb-2 mb-4">Clientes</h2>

      <button
        onClick={() => abrirModal()}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Adicionar Cliente
      </button>

      <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Nome</th>
            <th className="border px-3 py-2 text-left">Telefone</th>
            <th className="border px-3 py-2 text-left">Email</th>
            <th className="border px-3 py-2 text-left">Cidade</th>
            <th className="border px-3 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{c.nome}</td>
              <td className="border px-3 py-2">{c.telefone}</td>
              <td className="border px-3 py-2">{c.email}</td>
              <td className="border px-3 py-2">{c.cidade}</td>
              <td className="border px-3 py-2 text-center space-x-2">
                <button
                  onClick={() => abrirModal(c)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluir(c.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {clientes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-3 text-gray-500">
                Nenhum cliente cadastrado
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-96">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              {editando ? "Editar Cliente" : "Adicionar Cliente"}
            </h3>

            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              className="border rounded-lg p-2 w-full mb-3"
            />

            <input
              type="text"
              placeholder="Telefone"
              value={form.telefone}
              onChange={e => setForm({ ...form, telefone: e.target.value })}
              className="border rounded-lg p-2 w-full mb-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="border rounded-lg p-2 w-full mb-3"
            />

            <input
              type="text"
              placeholder="Cidade"
              value={form.cidade}
              onChange={e => setForm({ ...form, cidade: e.target.value })}
              className="border rounded-lg p-2 w-full mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={fecharModal}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={salvar}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
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
