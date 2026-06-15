import { useEffect, useState, useRef } from "react";
import api from "@/services/api";
import OrdensForm from "@/components/ordens/OrdensForm";
import Comprovante from "@/components/Comprovante";
import ComprovanteTermico from "@/components/ComprovanteTermico";
import Recibo from "@/components/Recibo";

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [popupItens, setPopupItens] = useState(false);
  const [popupComprovante, setPopupComprovante] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("comprovante");

  const comprovanteRef = useRef(null);

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
    setTipoDocumento("comprovante");
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

  // Impressão térmica
  const imprimirTermico = () => {
    if (!ordemSelecionada) return;
    const conteudo = document.getElementById("comprovante-termico");
    if (!conteudo) return;

    const printWindow = window.open("", "_blank", "width=300,height=600");
    printWindow.document.write(`
      <html>
        <head><title>Impressão</title></head>
        <body>${conteudo.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Gerar PDF (somente comprovante)
  const gerarPDF = async () => {
    if (!comprovanteRef.current || !ordemSelecionada) return;
    setGerandoPdf(true);
    try {
      await comprovanteRef.current.gerarPDF();
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold border-b pb-2 mb-4">
        Ordens de Serviço
      </h1>

      {/* BOTÕES SUPERIORES */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => abrirForm()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nova Ordem
        </button>

        <button
          onClick={carregarOrdens}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Recarregar
        </button>
      </div>

      {/* TABELA */}
      <table className="w-full table-auto border-collapse border border-gray-300">
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
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border px-3 py-2">{o.id}</td>
              <td className="border px-3 py-2">{o.cliente_nome}</td>
              <td className="border px-3 py-2">{o.equipamento}</td>
              <td className="border px-3 py-2">{o.status}</td>

              <td className="border px-3 py-2 flex gap-2 flex-wrap">
                <button
                  onClick={() => abrirItens(o)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Itens
                </button>

                <button
                  onClick={() => abrirComprovante(o)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Docs
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

      {/* POPUP COMPROVANTE / RECIBO */}
      {popupComprovante && ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl space-y-4">

            {/* TROCA */}
            <div className="flex gap-2">
              <button
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

            {/* CONTEÚDO */}
            {tipoDocumento === "comprovante" ? (
              <Comprovante ordem={ordemSelecionada} ref={comprovanteRef} />
            ) : (
              <Recibo ordem={ordemSelecionada} />
            )}

            {/* AÇÕES */}
            <div className="flex justify-end gap-2">
              {tipoDocumento === "comprovante" && (
                <>
                  <button
                    onClick={gerarPDF}
                    disabled={gerandoPdf}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {gerandoPdf ? "Gerando..." : "Gerar PDF"}
                  </button>

                  <button
                    onClick={imprimirTermico}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Imprimir Térmico
                  </button>
                </>
              )}

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

      {/* TÉRMICO ESCONDIDO */}
      {ordemSelecionada && (
        <div style={{ display: "none" }}>
          <div id="comprovante-termico">
            <ComprovanteTermico ordem={ordemSelecionada} />
          </div>
        </div>
      )}

      {/* POPUP ITENS */}
      {popupItens && ordemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold">
              Itens da Ordem #{ordemSelecionada.id}
            </h2>

            <button
              className="bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setPopupItens(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* POPUP FORM */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <OrdensForm
            ordemSelecionada={ordemSelecionada}
            fecharForm={() => setMostrarForm(false)}
            carregarOrdens={carregarOrdens}
          />
        </div>
      )}
    </div>
  );
}
