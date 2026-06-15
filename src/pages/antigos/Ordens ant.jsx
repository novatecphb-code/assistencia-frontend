import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Comprovante from "../components/Comprovante";

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [form, setForm] = useState({
    cliente_nome: "",
    equipamento: "",
    status: "",
    valor_total: "",
  });

  const comprovanteRef = useRef();

  useEffect(() => {
    carregarOrdens();
  }, []);

  const carregarOrdens = () => {
    fetch("http://localhost:3001/api/ordens")
      .then((res) => res.json())
      .then((data) => setOrdens(data));
  };

  const salvarOrdem = () => {
    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:3001/api/ordens/${editando.id}`
      : `http://localhost:3001/api/ordens`;

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      carregarOrdens();
      fecharModal();
    });
  };

  const excluirOrdem = (id) => {
    if (!confirm("Deseja excluir esta ordem?")) return;
    fetch(`http://localhost:3001/api/ordens/${id}`, {
      method: "DELETE",
    }).then(() => carregarOrdens());
  };

  const abrirModal = (ordem = null) => {
    setEditando(ordem);
    setForm(
      ordem || {
        cliente_nome: "",
        equipamento: "",
        status: "",
        valor_total: "",
      }
    );
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setEditando(null);
  };

  /* =========================
     🔥 NOVA FUNÇÃO (INTEGRAÇÃO)
  ========================== */
  const finalizarOS = async (ordem) => {
    try {
      // Atualiza status
      await fetch(`http://localhost:3001/api/ordens/${ordem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ordem,
          status: "Concluída",
        }),
      });

      // Verifica financeiro
      const res = await fetch(
        `http://localhost:3001/api/financeiro/por-ordem/${ordem.id}`
      );
      const data = await res.json();

      // Cria se não existir
      if (data.length === 0) {
        await fetch("http://localhost:3001/api/financeiro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "entrada",
            descricao: `OS #${ordem.id} - ${ordem.cliente_nome}`,
            valor: Number(ordem.valor_total || 0),
            ordem_id: ordem.id,
          }),
        });
      }

      alert("OS finalizada e lançada no financeiro!");

      carregarOrdens();
    } catch (err) {
      console.error(err);
      alert("Erro ao finalizar OS");
    }
  };

  const gerarPDF = async () => {
    if (!comprovanteRef.current) return;
    const canvas = await html2canvas(comprovanteRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`comprovante_ordem_${ordemSelecionada.id}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ordens de Serviço</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => abrirModal()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nova Ordem
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {ordens.map((o, index) => (
          <div
            key={o.id}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center
              p-4 rounded shadow-sm
              ${index % 2 === 0 ? "bg-white" : "bg-blue-50"}
              border border-gray-200`}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 flex-1">
              <span className="font-semibold">ID: {o.id}</span>
              <span>Cliente: {o.cliente_nome}</span>
              <span>Equipamento: {o.equipamento}</span>
              <span>Status: {o.status}</span>
              <span>Valor: R$ {o.valor_total}</span>
            </div>

            <div className="mt-2 sm:mt-0 flex gap-2">
              <button
                onClick={() => abrirModal(o)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => excluirOrdem(o.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Excluir
              </button>

              <button
                onClick={() => finalizarOS(o)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Concluir OS
              </button>

              <button
                onClick={() => setOrdemSelecionada(o)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Ver Comprovante
              </button>

              <button
                onClick={gerarPDF}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Baixar PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {editando ? "Editar Ordem" : "Nova Ordem"}
            </h2>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Cliente"
              value={form.cliente_nome}
              onChange={(e) =>
                setForm({ ...form, cliente_nome: e.target.value })
              }
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Equipamento"
              value={form.equipamento}
              onChange={(e) =>
                setForm({ ...form, equipamento: e.target.value })
              }
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Status"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Valor"
              value={form.valor_total}
              onChange={(e) =>
                setForm({ ...form, valor_total: e.target.value })
              }
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={fecharModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={salvarOrdem}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPROVANTE */}
      {ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded" ref={comprovanteRef}>
            <Comprovante ordem={ordemSelecionada} />
            <button
              onClick={() => setOrdemSelecionada(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}