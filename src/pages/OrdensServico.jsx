import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import OrdensForm from "@/components/ordens/OrdensForm";
import Recibo from "../components/recibo/Recibo";
import ComprovanteTermico from "@/components/ComprovanteTermico";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [popupComprovante, setPopupComprovante] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);

  const navigate = useNavigate();

  /* =========================
     CARREGAR ORDENS
  ========================== */
  const carregarOrdens = async () => {
    try {
      const res = await api.get("/ordens");
      const data = res.data?.data ?? res.data;
      setOrdens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar ordens:", err);
      setOrdens([]);
    }
  };

  useEffect(() => {
    carregarOrdens();
  }, []);
   
   useEffect(() => {
  if (popupComprovante && ordemSelecionada) {
    setTimeout(() => {
      gerarPDF(ordemSelecionada);
    }, 500);
  }
}, [popupComprovante, ordemSelecionada]);

  /* =========================
     FINALIZAR OS + RECIBO
  ========================== */
  const finalizarOS = async (ordem) => {
    try {
      if (ordem.status === "Concluída") {
        alert("Essa OS já está concluída!");
        return;
      }

      if (!ordem.totalOrdem || ordem.totalOrdem <= 0) {
        alert("Valor da OS inválido!");
        return;
      }

      const res = await api.put(`/ordens/${ordem.id}/pagar`);

      const ordemAtualizada = {
        ...ordem,
        status: "Concluída",
        totalOrdem: res.data?.data?.total || ordem.totalOrdem,
      };

      // 🔥 abre recibo automático
      setOrdemSelecionada(ordemAtualizada);
      setPopupComprovante(true);

      carregarOrdens();

    } catch (err) {
      console.error("ERRO:", err?.response?.data || err);

      alert(
        err?.response?.data?.message ||
        "Erro ao finalizar OS"
      );
    }
  };

  /* =========================
     AÇÕES
  ========================== */
  const abrirForm = (ordem = null) => {
    setOrdemSelecionada(ordem);
    setMostrarForm(true);
  };

  const abrirComprovante = (ordem) => {
    setOrdemSelecionada(ordem);
    setPopupComprovante(true);
  };

  const excluir = async (id) => {
    if (!window.confirm("Deseja excluir esta ordem?")) return;
    try {
      await api.delete(`/ordens/${id}`);
      carregarOrdens();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  const imprimirTermico = () => {
    const conteudo = document.getElementById("comprovante-termico");
    if (!conteudo) return;

    const win = window.open("", "_blank", "width=300,height=600");
    win.document.write(`<html><body>${conteudo.innerHTML}</body></html>`);
    win.document.close();
    win.print();
    win.close();
  };
    async function gerarPDF(ordem) {
  const elemento = document.getElementById("recibo-pdf");
  if (!elemento) return;

  const canvas = await html2canvas(elemento, {
    scale: 3,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const margem = 10;
const largura = 190; // A4 - margens
const altura = (canvas.height * largura) / canvas.width;

pdf.addImage(imgData, "PNG", margem, margem, largura, altura);

  const numeroOS = String(ordem.id || 0).padStart(6, "0");

  pdf.save(`Recibo_${numeroOS}.pdf`);
} 

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border w-full max-w-6xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Ordens de Serviço</h1>

      {/* BOTÕES */}
      <div className="flex gap-2">
        <button
          onClick={() => abrirForm()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Nova Ordem
        </button>

        <button
          onClick={carregarOrdens}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Recarregar
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          X
        </button>
      </div>
             
      {/* TABELA */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Cliente</th>
            <th className="border px-3 py-2">Equipamento</th>
            <th className="border px-3 py-2">Valor</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {ordens.map((o, i) => (
            <tr
              key={o.id}
              className={
                o.status === "Concluída"
                  ? "bg-green-50"
                  : i % 2
                  ? "bg-gray-50"
                  : ""
              }
            >
              <td className="border px-3 py-2">{o.id}</td>
              <td className="border px-3 py-2">{o.cliente_nome}</td>
              <td className="border px-3 py-2">{o.equipamento}</td>

              <td className="border px-3 py-2">
                R$ {Number(o.totalOrdem || 0).toFixed(2)}
              </td>

              <td className="border px-3 py-2">
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    o.status === "Concluída"
                      ? "bg-green-600"
                      : o.status === "Em Análise"
                      ? "bg-yellow-500"
                      : o.status === "Aguardando Peça"
                      ? "bg-orange-500"
                      : "bg-gray-500"
                  }`}
                >
                  {o.status}
                </span>
              </td>

              <td className="border px-3 py-2 flex gap-2 flex-wrap">
                <button
                  onClick={() => abrirComprovante(o)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Recibo
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

                <button
                  onClick={() => finalizarOS(o)}
                  disabled={!o.totalOrdem || o.status === "Concluída"}
                  className={`px-2 py-1 rounded text-white ${
                    !o.totalOrdem
                      ? "bg-gray-400 cursor-not-allowed"
                      : o.status === "Concluída"
                      ? "bg-green-700 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {o.status === "Concluída"
                    ? "Finalizada"
                    : "Finalizar OS"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FORM */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <OrdensForm
            ordemSelecionada={ordemSelecionada}
            fecharForm={() => setMostrarForm(false)}
            carregarOrdens={carregarOrdens}
          />
        </div>
      )}

      {/* RECIBO */}
      {popupComprovante && ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl">

            <Recibo ordem={ordemSelecionada} />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={imprimirTermico}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Imprimir
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

      {/* TÉRMICO */}
      {ordemSelecionada && (
        <div style={{ display: "none" }}>
          <div id="comprovante-termico">
            <ComprovanteTermico ordem={ordemSelecionada} />
          </div>
        </div>
      )}
    </div>
  );
};