// src/pages/OrdensServico.jsx
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
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

  useEffect(() => {
    carregarOrdens();
  }, []);

  function carregarOrdens() {
    fetch("http://localhost:3001/api/ordens")
      .then((res) => res.json())
      .then((data) => setOrdens(data));
  }

  function salvarOrdem() {
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
  }

  function excluirOrdem(id) {
    if (!confirm("Deseja excluir esta ordem?")) return;

    fetch(`http://localhost:3001/api/ordens/${id}`, {
      method: "DELETE",
    }).then(() => carregarOrdens());
  }

  function abrirModal(ordem = null) {
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
  }

  function fecharModal() {
    setModalOpen(false);
    setEditando(null);
  }

  function salvarPDF(ordem) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    ReactDOM.render(<Comprovante ordem={ordem} />, container);

    html2canvas(container).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`comprovante_ordem_${ordem.id}.pdf`);

      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ordens de Serviço</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => abrirModal()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Nova Ordem
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
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
              border border-gray-200
              hover:shadow-md transition`}
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
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => excluirOrdem(o.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Excluir
              </button>
              <button
                onClick={() => setOrdemSelecionada(o)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
              >
                Ver Comprovante
              </button>
              <button
                onClick={() => salvarPDF(o)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
              >
                Baixar PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE NOVA/EDITAR ORDEM */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              onChange={(e) => setForm({ ...form, status: e.target.value })}
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
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>

              <button
                onClick={salvarOrdem}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COMPROVANTE */}
      {ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded">
            <Comprovante ordem={ordemSelecionada} />
            <button
              onClick={() => setOrdemSelecionada(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
