// src/pages/OrdensServico.jsx
import { useEffect, useState, useRef } from "react";
import api from "@/services/api";
import OrdensForm from "@/components/ordens/OrdensForm";
import Comprovante from "@/components/Comprovante";
import ComprovanteTermico from "@/components/ComprovanteTermico";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Função auxiliar para formatação de datas
function formatarData(data) {
  if (!data) return "";
  const d = new Date(data);
  if (isNaN(d)) return data;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [popupItens, setPopupItens] = useState(false);
  const [popupComprovante, setPopupComprovante] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const comprovanteRef = useRef(null);

  // Carregar todas as ordens
  const carregarOrdens = async () => {
    try {
      const { data } = await api.get("/ordens");
      setOrdens(data);
    } catch (err) {
      console.error("Erro ao carregar ordens:", err);
    }
  };

  useEffect(() => {
    carregarOrdens();
  }, []);

  // Abrir modais
  const abrirItens = (ordem) => {
    setOrdemSelecionada(ordem);
    setPopupItens(true);
    setPopupComprovante(false);
    setMostrarForm(false);
  };

  const abrirForm = (ordem = null) => {
    setOrdemSelecionada(ordem);
    setMostrarForm(true);
    setPopupItens(false);
    setPopupComprovante(false);
  };

  const abrirComprovante = (ordem) => {
    setOrdemSelecionada(ordem);
    setPopupComprovante(true);
    setPopupItens(false);
    setMostrarForm(false);
  };

  const excluir = async (id) => {
    if (!id) return;
    try {
      await api.delete(`/ordens/${id}`);
      carregarOrdens();
    } catch (err) {
      console.error("Erro ao excluir ordem:", err);
    }
  };

  // Gerar PDF
  const gerarPDF = () => {
    if (!ordemSelecionada) return;
    setGerandoPdf(true);

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 70;

    // Bordas
    doc.setLineWidth(1.8);
    doc.roundedRect(40, 40, pageWidth - 80, 750, 6, 6);

    // Cabeçalho
    doc.setFillColor(240, 240, 240);
    doc.rect(40, 40, pageWidth - 80, 60, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("COMPROVANTE DE ORDEM DE SERVIÇO", pageWidth / 2, 80, { align: "center" });

    y = 130;

    const section = (title) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, 60, y);
      y += 10;
      doc.setLineWidth(0.6);
      doc.line(60, y, pageWidth - 60, y);
      y += 20;
    };

    const line = (label, value) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(label, 60, y);
      doc.text(value, pageWidth - 60, y, { align: "right" });
      y += 22;
    };

    // Dados da ordem
    section("DADOS DO CLIENTE");
    line("Cliente:", ordemSelecionada.cliente?.nome || "Não informado");
    line("CPF:", ordemSelecionada.cliente?.cpf || "Não informado");
    line("Abertura:", formatarData(ordemSelecionada.data_abertura));

    y += 15;
    section("SERVIÇO");
    const desc = doc.splitTextToSize(ordemSelecionada.servico || "Não informado", pageWidth - 120);
    doc.text(desc, 60, y);
    y += desc.length * 16 + 5;
    line("Valor do serviço:", `R$ ${Number(ordemSelecionada.valor_servico || 0).toFixed(2)}`);

    y += 10;
    section("ITENS");
    if (!ordemSelecionada.itens || ordemSelecionada.itens.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Nenhum item adicionado", 60, y);
      y += 20;
    } else {
      ordemSelecionada.itens.forEach((item) => {
        line(`${item.nome}`, `R$ ${Number(item.valor).toFixed(2)}`);
      });
    }

    y += 20;
    doc.setLineWidth(1);
    doc.line(60, y, pageWidth - 60, y);
    y += 30;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("TOTAL:", 60, y);
    doc.text(
      `R$ ${Number(ordemSelecionada.total || 0).toFixed(2)}`,
      pageWidth - 60,
      y,
      { align: "right" }
    );

    y += 50;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Obrigado pela preferência!", pageWidth / 2, y, { align: "center" });

    doc.save(`OS-${ordemSelecionada.id}.pdf`);
    setGerandoPdf(false);
  };

  // Impressão térmica
  const imprimirTermico = () => {
    if (!ordemSelecionada) return;
    const conteudo = document.getElementById("comprovante-termico");
    if (!conteudo) return;

    const printWindow = window.open("", "_blank", "width=300,height=600");
    printWindow.document.write(`
      <html><head><title>Impressão</title></head>
      <body>${conteudo.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold border-b pb-2 mb-4">Ordens de Serviço</h1>

      <div className="flex gap-2">
        <button
          onClick={() => abrirForm()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Nova Ordem
        </button>

        <button
          onClick={() => carregarOrdens()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Recarregar
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Cliente</th>
            <th className="border px-3 py-2">Equipamento</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {ordens.map((o, index) => (
            <tr
              key={o.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:shadow-md`}
            >
              <td className="border px-3 py-2">{o.id}</td>
              <td className="border px-3 py-2">{o.cliente_nome}</td>
              <td className="border px-3 py-2">{o.equipamento}</td>
              <td className="border px-3 py-2">{o.status}</td>
              <td className="border px-3 py-2 flex gap-2">
                <button
                  onClick={() => abrirItens(o)}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                >
                  Itens
                </button>
                <button
                  onClick={() => abrirComprovante(o)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                >
                  Comprovante
                </button>
                <button
                  onClick={() => abrirForm(o)}
                  className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluir(o.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Comprovante */}
      {popupComprovante && ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl space-y-4">
            <div ref={comprovanteRef}>
              <Comprovante ordem={ordemSelecionada} />
            </div>

            <div className="flex justify-between">
              <button
                onClick={gerarPDF}
                disabled={gerandoPdf}
                className={`px-4 py-2 rounded text-white ${
                  gerandoPdf ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {gerandoPdf ? "Gerando..." : "Baixar PDF"}
              </button>
              <button
                onClick={imprimirTermico}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Imprimir Térmico
              </button>
              <button
                onClick={() => setPopupComprovante(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprovante Térmico Oculto */}
      {ordemSelecionada && (
        <div style={{ display: "none" }}>
          <div id="comprovante-termico">
            <ComprovanteTermico ordem={ordemSelecionada} />
          </div>
        </div>
      )}

      {/* Popup Itens */}
      {popupItens && ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">
              Itens da Ordem #{ordemSelecionada.id}
            </h2>

            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-3 py-2">Produto</th>
                  <th className="border px-3 py-2">Qtd</th>
                  <th className="border px-3 py-2">Valor Unit.</th>
                  <th className="border px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {ordemSelecionada.itens.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{i.produto_nome}</td>
                    <td className="border px-3 py-2">{i.quantidade}</td>
                    <td className="border px-3 py-2">R$ {i.preco_unit ?? 0}</td>
                    <td className="border px-3 py-2">R$ {i.total_item ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              onClick={() => setPopupItens(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Popup Formulário */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
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
