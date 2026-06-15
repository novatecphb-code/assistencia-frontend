import React, { useEffect, useState } from "react";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    nivel: "usuario",
  });

  // 🔐 Token
  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await fetch("http://localhost:3001/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        alert("Acesso negado! Somente administradores.");
        return;
      }

      const data = await res.json();
      setUsuarios(data);
    } catch (e) {
      console.error("Erro ao listar usuários:", e);
    }
  }

  async function salvarUsuario() {
    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:3001/api/usuarios/${editando.id}`
      : `http://localhost:3001/api/usuarios`;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const erro = await res.json();
        return alert("Erro: " + erro.error);
      }

      carregarUsuarios();
      fecharModal();
    } catch (e) {
      console.error("Erro ao salvar usuário:", e);
    }
  }

  async function excluirUsuario(id) {
    if (!confirm("Deseja excluir este usuário?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      carregarUsuarios();
    } catch (e) {
      console.error("Erro ao excluir:", e);
    }
  }

  function abrirModal(usuario = null) {
    setEditando(usuario);
    setForm(
      usuario || {
        nome: "",
        email: "",
        senha: "",
        nivel: "usuario",
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
      <h1 className="text-2xl font-bold mb-6">Usuários do Sistema</h1>

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
        Novo Usuário
      </button>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Nível</th>
            <th className="p-2 border">Criado em</th>
            <th className="p-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, index) => (
            <tr
              key={u.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100 transition`}
            >
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.nome}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border capitalize">{u.nivel}</td>
              <td className="p-2 border">{u.criado_em?.substring(0, 10)}</td>
              <td className="p-2 border">
                <button
                  onClick={() => abrirModal(u)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirUsuario(u.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🟦 Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {editando ? "Editar Usuário" : "Novo Usuário"}
            </h2>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {!editando && (
              <input
                type="password"
                className="border p-2 w-full mb-2"
                placeholder="Senha"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
              />
            )}

            <select
              className="border p-2 w-full mb-2"
              value={form.nivel}
              onChange={(e) => setForm({ ...form, nivel: e.target.value })}
            >
              <option value="admin">Administrador</option>
              <option value="usuario">Usuário Comum</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={fecharModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvarUsuario}
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
