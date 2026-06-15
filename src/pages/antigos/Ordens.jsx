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
    status: "Aberta",
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

  /* =========================
     SALVAR ORDEM (COM REGRA)
  ========================== */
  const salvarOrdem = async () => {
    try {
      const metodo = editando ? "PUT" : "POST";
      const url = editando
        ? `http://localhost:3001/api/ordens/${editando.id}`
        : `http://localhost:3001/api/ordens`;

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const ordemSalva = await res.json();

      // 🔥 ENVIA PRO FINANCEIRO SE FOR CONCLUÍDA
      if (form.status === "Concluída" && !editando) {
        await fetch("http://localhost:3001/api/financeiro", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipo: "entrada",
            descricao: `OS #${ordemSalva.id} - ${ordemSalva.cliente_nome}`,
            valor: Number(ordemSalva.valor_total || 0),
          }),
        });
      }

      alert("Ordem salva com sucesso!");
      fecharModal();
      carregarOrdens();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar ordem");
    }
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
        status: "Aberta",
        valor_total: "",
      }
    );
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setEditando(null);
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
          className="bg-green-600 text-white px-4 py-2 rounded"
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

      {/* LISTA */}
      <div className="flex flex-col gap-4">
        {ordens.map((o, index) => (
          <div
            key={o.id}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center
              p-4 rounded shadow
              ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              border`}
          >
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <span><b>ID:</b> {o.id}</span>
              <span><b>Cliente:</b> {o.cliente_nome}</span>
              <span><b>Equipamento:</b> {o.equipamento}</span>

              {/* STATUS COLORIDO */}
              <span
                className={`px-2 py-1 rounded text-white text-sm
                  ${o.status === "Aberta" && "bg-gray-500"}
                  ${o.status === "Em andamento" && "bg-blue-500"}
                  ${o.status === "Concluída" && "bg-green-600"}
                `}
              >
                {o.status}
              </span>

              <span><b>R$:</b> {o.valor_total}</span>
            </div>

            {/* AÇÕES */}
            <div className="flex gap-2 mt-2 sm:mt-0">
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
                onClick={() => setOrdemSelecionada(o)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Docs
              </button>

              <button
                onClick={gerarPDF}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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

            {/* STATUS */}
            <select
              className="border p-2 w-full mb-2"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option>Aberta</option>
              <option>Em andamento</option>
              <option>Concluída</option>
            </select>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div ref={comprovanteRef} className="bg-white p-6 rounded">
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