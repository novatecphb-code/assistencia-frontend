import { useState, useEffect } from "react";
import api from "@/services/api";
import VoltarButton from "@/components/VoltarButton";

/* =========================
   Função segura para números
========================= */
function safeNum(value) {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

/* =========================
   Função segura para datas
========================= */
function safeDate(date) {
  if (!date) return new Date().toISOString().substring(0, 10);
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().toISOString().substring(0, 10) : d.toISOString().substring(0, 10);
}

export default function Financeiro() {
  const [lista, setLista] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0, quantidade: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    tipo: "entrada",
    categoria: "",
    descricao: "",
    valor: "",
    data: safeDate(),
  });


  /* =========================
     CARREGAR LISTA
  ========================== */
  const carregar = async () => {
    try {
      const { data } = await api.get("/financeiro");
      const arr = Array.isArray(data) ? data : [];
      setLista(
        arr.map((item) => ({
          ...item,
          valor: safeNum(item.valor),
          data: safeDate(item.data),
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar financeiro:", err);
      setLista([]);
    }
  };

  /* =========================
     CARREGAR RESUMO
  ========================== */
  const carregarResumo = async () => {
    try {
      const { data } = await api.get("/financeiro/resumo");
      setResumo({
        entradas: safeNum(data.entradas),
        saidas: safeNum(data.saidas),
        saldo: safeNum(data.saldo),
        quantidade: data.quantidade || 0,
      });
    } catch (err) {
      console.error("Erro ao carregar resumo:", err);
      setResumo({ entradas: 0, saidas: 0, saldo: 0, quantidade: 0 });
    }
  };

  useEffect(() => {
    carregar();
    carregarResumo();
  }, []);

  /* =========================
     MODAL
  ========================== */
  const abrirNovo = () => {
    setEditando(null);
    setForm({ tipo: "entrada", descricao: "", categoria: "", valor: "", data: safeDate() });
    setModalOpen(true);
  };

  const abrirEditar = (item) => {
    setEditando(item);
    setForm({
      tipo: item.tipo,
      categoria: item.categoria || "",
      descricao: item.descricao || "",
      valor: safeNum(item.valor),
      data: safeDate(item.data),
    });
    setModalOpen(true);
  };

  const fecharModal = () => {
    setEditando(null);
    setModalOpen(false);
  };

  /* =========================
     SALVAR MOVIMENTO
  ========================== */
  const salvar = async () => {
    try {
      const payload = { ...form, valor: safeNum(form.valor), data: safeDate(form.data) };
      if (editando) {
        await api.put(`/financeiro/${editando.id}`, payload);
      } else {
        await api.post("/financeiro", payload);
      }
      carregar();
      carregarResumo();
      fecharModal();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar movimento.");
    }
  };

  /* =========================
     EXCLUIR MOVIMENTO
  ========================== */
  const excluir = async (id) => {
    if (!confirm("Deseja excluir este registro?")) return;
    try {
      await api.delete(`/financeiro/${id}`);
      carregar();
      carregarResumo();
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir registro.");
    }
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-5xl mx-auto">
     
     <VoltarButton />

      <h1 className="text-2xl font-bold border-b pb-2 mb-4">Financeiro</h1>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm">Entradas</p>
          <p className="font-bold text-green-700">R$ {safeNum(resumo.entradas).toFixed(2)}</p>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm">Saídas</p>
          <p className="font-bold text-red-700">R$ {safeNum(resumo.saidas).toFixed(2)}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm">Saldo</p>
          <p className={`font-bold ${resumo.saldo >= 0 ? "text-green-700" : "text-red-700"}`}>
            R$ {safeNum(resumo.saldo).toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Movimentos</p>
          <p className="font-bold">{resumo.quantidade}</p>
        </div>
      </div>

      {/* AÇÕES */}
      <div className="flex justify-between mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={abrirNovo}
        >
          Novo Movimento
        </button>

        <div className="text-xl font-bold">
          Saldo Geral:{" "}
          <span className={resumo.saldo >= 0 ? "text-green-700" : "text-red-700"}>
            R$ {safeNum(resumo.saldo).toFixed(2)}
          </span>
        </div>
      </div>

      {/* TABELA */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">Tipo</th>
            <th className="border px-3 py-2">Categoria</th>
            <th className="border px-3 py-2">Descrição</th>
            <th className="border px-3 py-2">Valor</th>
            <th className="border px-3 py-2">Data</th>
            <th className="border px-3 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2 capitalize">{item.tipo}</td>
              <td className="border px-3 py-2">{item.descricao}</td>
              <td className="border px-3 py-2">R$ {safeNum(item.valor).toFixed(2)}</td>
              <td className="border px-3 py-2">{item.data.split("-").reverse().join("/")}</td>
              <td className="border px-3 py-2 flex gap-1">
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => abrirEditar(item)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => excluir(item.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {lista.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-3 text-gray-500">
                Nenhum registro encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">{editando ? "Editar Movimento" : "Novo Movimento"}</h2>

             <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="border p-2 rounded w-full"
              
              >
               {/* Tipo */}
              <select
               value={form.tipo}
               onChange={(e) =>
               setForm({
               ...form,
               tipo: e.target.value,
               categoria: "", // limpa categoria ao trocar tipo
               })
               }
                className="border p-2 rounded w-full"
               >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
               </select>

               {/* Categoria*/}
               <select
               value={form.categoria}
               onChange={(e) =>
               setForm({ ...form, categoria: e.target.value })
               }
               className="border p-2 rounded w-full"
               > 
               <option value="">Selecione a categoria</option>

               {form.tipo === "entrada" ? (
               <>
               <option value="Receita OS">Receita OS</option>
               <option value="Venda Produto">Venda Produto</option>
               <option value="Recebimento Cliente">Recebimento Cliente</option>
               <option value="Outras Receitas">Outras Receitas</option>
               </>
               ) : (
               <>
               <option value="Compra de Peças">Compra de Peças</option>
               <option value="Ferramentas">Ferramentas</option>
               <option value="Internet">Internet</option>
               <option value="Energia">Energia</option>
               <option value="Aluguel">Aluguel</option>
               <option value="Combustível">Combustível</option>
               <option value="Impostos">Impostos</option>
               <option value="Retirada Pessoal">Retirada Pessoal</option>
               <option value="Outros">Outros</option>
               </>
               )}
               </select>
               <option value="entrada">Entrada</option>
               <option value="saida">Saída</option>
               </select>

               <input
               placeholder="Descrição"
               className="border p-2 rounded w-full"
               value={form.descricao}
               onChange={(e) => setForm({ ...form, descricao: e.target.value })}
               />

               <input
               type="number"
               placeholder="Valor"
               className="border p-2 rounded w-full"
               value={form.valor}
               onChange={(e) => setForm({ ...form, valor: e.target.value })}
               />

               <input
               type="date"
               className="border p-2 rounded w-full"
               value={form.data}
               onChange={(e) => setForm({ ...form, data: e.target.value })}
               />

               <div className="flex justify-between">
               <button
                onClick={fecharModal}
                className="bg-gray-600 text-white px-4 py-2 rounded"
               >
                Cancelar
               </button>
               <button
                onClick={salvar}
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
