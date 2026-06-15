import { useEffect, useState } from "react";
import api from "@/services/api";
import VoltarButton from "@/components/VoltarButton";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    fornecedor: "",
    custo: "",
    preco: "",
    estoque: "",
  });

  // ===========================
  // CARREGAR PRODUTOS
  // ===========================
  const carregar = async () => {
    try {
      const { data } = await api.get("/produtos");
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // ===========================
  // MODAL
  // ===========================
  const abrirNovo = () => {
    setEditando(null);
    setForm({
      nome: "",
      descricao: "",
      fornecedor: "",
      custo: "",
      preco: "",
      estoque: "",
    });
    setModalOpen(true);
  };

  const abrirEditar = (p) => {
    setEditando(p);
    setForm({
      nome: p.nome,
      descricao: p.descricao,
      fornecedor: p.fornecedor ?? "",
      custo: p.custo,
      preco: p.preco,
      estoque: p.estoque,
    });
    setModalOpen(true);
  };

  const fechar = () => {
    setModalOpen(false);
    setEditando(null);
  };

  // ===========================
  // SALVAR PRODUTO
  // ===========================
  const salvar = async () => {
    try {
      const payload = {
        ...form,
        custo: Number(form.custo),
        preco: Number(form.preco),
        estoque: Number(form.estoque),
      };

      if (editando) {
        await api.put(`/produtos/${editando.id}`, payload);
      } else {
        await api.post("/produtos", payload);
      }

      carregar();
      fechar();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar produto!");
    }
  };

  // ===========================
  // EXCLUIR PRODUTO
  // ===========================
  const excluir = async (id) => {
    if (!confirm("Deseja excluir este produto?")) return;
    try {
      await api.delete(`/produtos/${id}`);
      carregar();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  // ===========================
  // LUCRO AUTOMÁTICO
  // ===========================
  const lucro = (p) => {
    return Number(p.preco) - Number(p.custo);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-5xl mx-auto">
         <VoltarButton /> 
     
      <h1 className="text-2xl font-bold border-b pb-2 mb-4">Produtos</h1>

      <button
        onClick={abrirNovo}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        Novo Produto
      </button>

      {/* LISTA */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">Nome</th>
            <th className="border px-3 py-2">Fornecedor</th>
            <th className="border px-3 py-2">Custo</th>
            <th className="border px-3 py-2">Preço Venda</th>
            <th className="border px-3 py-2">Lucro</th>
            <th className="border px-3 py-2">Estoque</th>
            <th className="border px-3 py-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{p.nome}</td>
              <td className="border px-3 py-2">{p.fornecedor ?? "—"}</td>
              <td className="border px-3 py-2">R$ {Number(p.custo).toFixed(2)}</td>
              <td className="border px-3 py-2">R$ {Number(p.preco).toFixed(2)}</td>
              <td className="border px-3 py-2 text-green-700 font-bold">
                R$ {lucro(p).toFixed(2)}
              </td>
              <td className="border px-3 py-2">{p.estoque}</td>

              <td className="border px-3 py-2 flex gap-2">
                <button
                  onClick={() => abrirEditar(p)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Editar
                </button>

                <button
                  onClick={() => excluir(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg space-y-4">

            <h2 className="text-xl font-bold border-b pb-2">
              {editando ? "Editar Produto" : "Novo Produto"}
            </h2>

            <input
              className="border p-2 rounded w-full"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            <textarea
              className="border p-2 rounded w-full"
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />

            <input
              className="border p-2 rounded w-full"
              placeholder="Fornecedor"
              value={form.fornecedor}
              onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                className="border p-2 rounded w-full"
                type="number"
                placeholder="Custo"
                value={form.custo}
                onChange={(e) => setForm({ ...form, custo: e.target.value })}
              />

              <input
                className="border p-2 rounded w-full"
                type="number"
                placeholder="Preço venda"
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
              />

              <input
                className="border p-2 rounded w-full"
                type="number"
                placeholder="Estoque"
                value={form.estoque}
                onChange={(e) => setForm({ ...form, estoque: e.target.value })}
              />
            </div>

            {/* LUCRO EM TEMPO REAL */}
            <div className="p-3 bg-gray-100 rounded text-center font-bold">
              Lucro estimado:{" "}
              <span className="text-green-700">
                R$
                {(
                  Number(form.preco || 0) - Number(form.custo || 0)
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <button
                onClick={fechar}
                className="bg-gray-600 px-4 py-2 text-white rounded"
              >
                Cancelar
              </button>

              <button
                onClick={salvar}
                className="bg-green-600 px-4 py-2 text-white rounded"
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
