import React, { useState, useEffect } from "react";

export default function OrdensForm({ onClose }) {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    cliente_id: "",
    equipamento: "",
    defeito: "",
    status: "Aberto",
    valor_total: 0,
    previsao: "",
  });
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({ produto_id: "", quantidade: 1, preco_unit: 0 });

  // Carregar clientes e produtos
  useEffect(() => {
    fetch("http://localhost:3001/api/clientes")
      .then((res) => res.json())
      .then(setClientes);

    fetch("http://localhost:3001/api/produtos")
      .then((res) => res.json())
      .then(setProdutos);
  }, []);

  // Atualizar valor total
  useEffect(() => {
    const total = itens.reduce((sum, i) => sum + i.quantidade * i.preco_unit, 0);
    setForm((prev) => ({ ...prev, valor_total: total }));
  }, [itens]);

  // Adicionar item à lista
  function adicionarItem() {
    if (!novoItem.produto_id || novoItem.quantidade <= 0 || novoItem.preco_unit <= 0) return;
    setItens([...itens, { ...novoItem }]);
    setNovoItem({ produto_id: "", quantidade: 1, preco_unit: 0 });
  }

  // Remover item
  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  // Salvar ordem com itens
  function salvarOrdem() {
    if (!form.cliente_id || !form.equipamento) {
      alert("Preencha o cliente e equipamento");
      return;
    }

    fetch("http://localhost:3001/api/ordens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, itens }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Ordem criada com sucesso!");
        onClose();
      })
      .catch(console.error);
  }

  return (
    <div className="p-6 bg-white rounded shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Nova Ordem de Serviço</h2>

      <select
        className="border p-2 w-full mb-2"
        value={form.cliente_id}
        onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
      >
        <option value="">Selecione o cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Equipamento"
        className="border p-2 w-full mb-2"
        value={form.equipamento}
        onChange={(e) => setForm({ ...form, equipamento: e.target.value })}
      />
      <input
        type="text"
        placeholder="Defeito"
        className="border p-2 w-full mb-2"
        value={form.defeito}
        onChange={(e) => setForm({ ...form, defeito: e.target.value })}
      />
      <input
        type="date"
        className="border p-2 w-full mb-2"
        value={form.previsao}
        onChange={(e) => setForm({ ...form, previsao: e.target.value })}
      />

      <h3 className="text-lg font-semibold mt-4 mb-2">Itens da Ordem</h3>
      <div className="flex gap-2 mb-2">
        <select
          className="border p-2 flex-1"
          value={novoItem.produto_id}
          onChange={(e) => setNovoItem({ ...novoItem, produto_id: e.target.value })}
        >
          <option value="">Produto</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Qtd"
          className="border p-2 w-20"
          value={novoItem.quantidade}
          onChange={(e) => setNovoItem({ ...novoItem, quantidade: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Valor"
          className="border p-2 w-24"
          value={novoItem.preco_unit}
          onChange={(e) => setNovoItem({ ...novoItem, preco_unit: parseFloat(e.target.value) })}
        />
        <button onClick={adicionarItem} className="bg-green-600 text-white px-3 py-1 rounded">Adicionar</button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Produto</th>
            <th className="border px-2 py-1">Qtd</th>
            <th className="border px-2 py-1">Valor Unit.</th>
            <th className="border px-2 py-1">Subtotal</th>
            <th className="border px-2 py-1">Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item, index) => {
            const produto = produtos.find(p => p.id == item.produto_id);
            return (
              <tr key={index}>
                <td className="border px-2 py-1">{produto?.nome}</td>
                <td className="border px-2 py-1">{item.quantidade}</td>
                <td className="border px-2 py-1">R$ {item.preco_unit}</td>
                <td className="border px-2 py-1">R$ {item.quantidade * item.preco_unit}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => removerItem(index)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex justify-between">
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
        <button onClick={salvarOrdem} className="bg-blue-600 text-white px-4 py-2 rounded">Salvar Ordem</button>
      </div>
    </div>
  );
}
