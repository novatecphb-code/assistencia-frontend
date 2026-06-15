import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

import OrdensForm from "@/components/ordens/OrdensForm";
import Comprovante from "@/components/Comprovante";
import ComprovanteTermico from "@/components/ComprovanteTermico";
import Recibo from "@/components/Recibo";

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [popupComprovante, setPopupComprovante] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState("comprovante");
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const comprovanteRef = useRef(null);
  const navigate = useNavigate();

  /* =========================
     CARREGAR ORDENS
  ========================== */
  const carregarOrdens = async () => {
    try {
      const res = await api.get("/ordens");
      setOrdens(res.data.data ?? res.data);
    } catch (err) {
      console.error("Erro ao carregar ordens:", err);
    }
  };

  useEffect(() => {
    carregarOrdens();
  }, []);

  /* =========================
     AÇÕES
  ========================== */
  const abrirForm = (ordem = null) => {
    setOrdemSelecionada(ordem);
    setMostrarForm(true);
  };

  const abrirComprovante = (ordem) => {
    setOrdemSelecionada(ordem);
    setTipoDocumento("comprovante");
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

  /* =========================
     PDF / IMPRESSÃO
  ========================== */
  const gerarPDF = async () => {
    if (!comprovanteRef.current) return;
    setGerandoPdf(true);
    try {
      await comprovanteRef.current.gerarPDF();
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setGerandoPdf(false);
    }
  };

  const imprimirTermico = () => {
    const conteudo = document.getElementById("comprovante-termico");
    if (!conteudo) return;

    const win = window.open("", "_blank", "width=300,height=600");
    win.document.write(`<html><body>${conteudo.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border w-full max-w-6xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Ordens de Serviço</h1>

      {/* BOTÕES SUPERIORES */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => abrirForm()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nova Ordem
        </button>

        <button
          type="button"
          onClick={carregarOrdens}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Recarregar
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Voltar
        </button>
      </div>

      {/* TABELA */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Cliente</th>
            <th className="border px-3 py-2">Equipamento</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {ordens.map((o, i) => (
            <tr key={o.id} className={i % 2 ? "bg-gray-50" : ""}>
              <td className="border px-3 py-2">{o.id}</td>
              <td className="border px-3 py-2">{o.cliente_nome}</td>
              <td className="border px-3 py-2">{o.equipamento}</td>
              <td className="border px-3 py-2">{o.status}</td>
              <td className="border px-3 py-2 flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => abrirComprovante(o)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Docs
                </button>

                <button
                  type="button"
                  onClick={() => abrirForm(o)}
                  className="bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  type="button"
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

      {/* MODAL FORM */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <OrdensForm
            ordemSelecionada={ordemSelecionada}
            fecharForm={() => setMostrarForm(false)}
            carregarOrdens={carregarOrdens}
          />
        </div>
      )}

      {/* MODAL COMPROVANTE / RECIBO */}
      {popupComprovante && ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl space-y-4">

            {/* SELETOR */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTipoDocumento("comprovante")}
                className={`px-3 py-1 rounded ${
                  tipoDocumento === "comprovante"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Comprovante
              </button>

              <button
                type="button"
                onClick={() => setTipoDocumento("recibo")}
                className={`px-3 py-1 rounded ${
                  tipoDocumento === "recibo"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Recibo
              </button>
            </div>

            {/* DOCUMENTO */}
            {tipoDocumento === "comprovante" ? (
              <Comprovante ref={comprovanteRef} ordem={ordemSelecionada} />
            ) : (
              <div id="recibo-print">
                <Recibo ordem={ordemSelecionada} />
              </div>
            )}

            {/* AÇÕES */}
            <div className="flex justify-end gap-2">
              {tipoDocumento === "comprovante" && (
                <>
                  <button
                    type="button"
                    onClick={gerarPDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {gerandoPdf ? "Gerando..." : "Gerar PDF"}
                  </button>

                  <button
                    type="button"
                    onClick={imprimirTermico}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Imprimir
                  </button>
                </>
              )}

              {tipoDocumento === "recibo" && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Imprimir
                </button>
              )}

              <button
                type="button"
                onClick={() => setPopupComprovante(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPROVANTE TÉRMICO OCULTO */}
      {ordemSelecionada && (
        <div style={{ display: "none" }}>
          <div id="comprovante-termico">
            <ComprovanteTermico ordem={ordemSelecionada} />
          </div>
        </div>
      )}
    </div>
  );
}
