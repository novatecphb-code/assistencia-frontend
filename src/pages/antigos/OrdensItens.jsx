// ==============================
// FRONTEND: src/components/ordens/OrdensItens.jsx (REVISADO)
// ==============================
import React, { useState, useEffect } from 'react';
import api from '@/services/api';

export default function OrdensItens({ ordemId, onClose }) {
  const [itens, setItens] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ produto_id: '', produto_nome: '', quantidade: 1, preco_unit: 0 });

  useEffect(() => { carregarItens(); carregarProdutos(); }, [ordemId]);

  function carregarItens() { api.get(`/ordens/${ordemId}/itens`).then(r => setItens(r.data)).catch(console.error); }
  function carregarProdutos() { api.get('/produtos').then(r => setProdutos(r.data)).catch(console.error); }

  function abrirModal(item = null) {
    setEditando(item);
    setForm(item ? { ...item } : { produto_id: '', produto_nome: '', quantidade: 1, preco_unit: 0 });
    setModalOpen(true);
  }

  function fecharModal() { setModalOpen(false); setEditando(null); }

  async function salvarItem() {
    try {
      if (editando) {
        await api.put(`/ordens/${ordemId}/itens/${editando.id}`, form);
      } else {
        await api.post(`/ordens/${ordemId}/itens`, form);
      }
      carregarItens(); fecharModal();
    } catch (err) { console.error(err); }
  }

  async function excluirItem(id) { if (!confirm('Deseja excluir este item?')) return; await api.delete(`/ordens/${ordemId}/itens/${id}`); carregarItens(); }

  return (
    <div className="p-4 bg-white rounded shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Itens da Ordem #{ordemId}</h2>
      <button onClick={() => abrirModal()} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">Adicionar Item</button>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>...</thead>
        <tbody>
          {itens.map(item => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.produto_nome}</td>
              <td className="border px-2 py-1">{item.quantidade}</td>
              <td className="border px-2 py-1">R$ {item.preco_unit}</td>
              <td className="border px-2 py-1">R$ {item.total_item}</td>
              <td className="border px-2 py-1 flex gap-1">
                <button onClick={() => abrirModal(item)} className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
                <button onClick={() => excluirItem(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">{editando ? 'Editar Item' : 'Adicionar Item'}</h3>

            <select value={form.produto_id} onChange={e => {
              const id = Number(e.target.value);
              const produto = produtos.find(p => p.id === id);
              setForm({...form, produto_id: id, produto_nome: produto ? produto.nome : '', preco_unit: produto ? produto.preco : 0});
            }} className="border p-2 w-full mb-2">
              <option value="">Selecione o produto</option>
              {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>

            <input type="number" className="border p-2 w-full mb-2" value={form.quantidade} onChange={e => setForm({...form, quantidade: Number(e.target.value)})} />
            <input type="number" className="border p-2 w-full mb-2" value={form.preco_unit} onChange={e => setForm({...form, preco_unit: Number(e.target.value)})} />

            <div className="flex justify-between mt-4">
              <button onClick={fecharModal} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
              <button onClick={salvarItem} className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <button onClick={onClose} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Fechar</button>
    </div>
  );
}
