// src/pages/OrdensServico.jsx
import { useEffect, useState, useRef } from "react";
import api from "@/services/api";
import OrdensForm from "@/components/ordens/OrdensForm";
import Comprovante from "@/components/Comprovante";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [popupItens, setPopupItens] = useState(false);
  const [popupComprovante, setPopupComprovante] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const comprovanteRef = useRef(null);

  // Carrega todas as ordens
  async function carregarOrdens() {
    try {
      const { data } = await api.get("/ordens");
      setOrdens(data);
    } catch (err) {
      console.error("Erro ao carregar ordens:", err);
    }
  }

  function abrirItens(ordem) {
    setOrdemSelecionada(ordem);
    setPopupItens(true);
    setPopupComprovante(false);
    setMostrarForm(false);
  }

  function abrirForm(ordem = null) {
    setOrdemSelecionada(ordem);
    setMostrarForm(true);
    setPopupItens(false);
    setPopupComprovante(false);
  }

  function abrirComprovante(ordem) {
    setOrdemSelecionada(ordem);
    setPopupComprovante(true);
    setPopupItens(false);
    setMostrarForm(false);
  }

  async function excluir(id) {
    if (!id) return;
    try {
      await api.delete(`/ordens/${id}`);
      carregarOrdens();
    } catch (err) {
      console.error("Erro ao excluir ordem:", err);
    }
  }

  useEffect(() => {
    carregarOrdens();
  }, []);

  // GERAR PDF DO COMPROVANTE
  async function gerarPDF() {
    if (!ordemSelecionada) {
      console.warn("Nenhuma ordem selecionada para gerar PDF.");
      return;
    }
    const element = comprovanteRef.current;
    if (!element) {
      console.warn("Elemento do comprovante não encontrado (ref está vazio).");
      return;
    }

    try {
      setGerandoPdf(true);
      await new Promise((r) => setTimeout(r, 50)); // garante pintura

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`comprovante_os_${ordemSelecionada.id}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar PDF — veja console.");
    } finally {
      setGerandoPdf(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Ordens de Serviço</h1>

      <div className="flex gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => abrirForm()}
        >
          Nova Ordem
        </button>

        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => carregarOrdens()}
        >
          Recarregar
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Cliente</th>
            <th className="border px-2 py-1">Equipamento</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Ações</th>
          </tr>
        </thead>
        <tbody>
          {ordens.map((o) => (
            <tr key={o.id}>
              <td className="border px-2 py-1">{o.id}</td>
              <td className="border px-2 py-1">{o.cliente_nome}</td>
              <td className="border px-2 py-1">{o.equipamento}</td>
              <td className="border px-2 py-1">{o.status}</td>
              <td className="border px-2 py-1 flex items-center space-x-2">
                <button
                  onClick={() => abrirItens(o)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Itens
                </button>

                <button
                  onClick={() => abrirComprovante(o)}
                  className="bg-indigo-600 text-white px-2 py-1 rounded"
                >
                  Comprovante
                </button>

                <button
                  onClick={() => abrirForm(o)}
                  className="bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  onClick={() => excluir(o.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup de comprovante */}
      {popupComprovante && ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
            <div ref={comprovanteRef}>
              <Comprovante ordem={ordemSelecionada} />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={gerarPDF}
                disabled={gerandoPdf}
                className={`px-4 py-2 rounded text-white ${gerandoPdf ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {gerandoPdf ? "Gerando..." : "Baixar PDF"}
              </button>

              <button
                onClick={() => setPopupComprovante(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de itens */}
      {popupItens && ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">
              Itens da Ordem #{ordemSelecionada.id}
            </h2>

            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Produto</th>
                  <th className="border px-2 py-1">Qtd</th>
                  <th className="border px-2 py-1">Valor Unit.</th>
                  <th className="border px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {ordemSelecionada.itens.map((i) => (
                  <tr key={i.id}>
                    <td className="border px-2 py-1">{i.produto_nome}</td>
                    <td className="border px-2 py-1">{i.quantidade}</td>
                    <td className="border px-2 py-1">
                      R$ {i.preco_unit ?? 0}
                    </td>
                    <td className="border px-2 py-1">
                      R$ {i.total_item ?? 0}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border px-2 py-1" colSpan={3}>
                    Total da Ordem
                  </td>
                  <td className="border px-2 py-1">
                    R$ {ordemSelecionada.totalOrdem ?? 0}
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setPopupItens(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Popup formulário */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <OrdensForm
            ordem={ordemSelecionada}
            onClose={() => {
              setMostrarForm(false);
              carregarOrdens();
            }}
          />
        </div>
      )}
    </div>
  );
}
