import React from "react";

export default function Comprovante({ ordem, logo }) {
  if (!ordem) return <p>Nenhuma ordem selecionada.</p>;

  const formatarData = (data) =>
    new Date(data).toLocaleString("pt-BR", { hour12: false });

  const valorTotal = Number(ordem.valor_total || 0).toFixed(2);

  return (
    <div className="p-4 max-w-xl mx-auto bg-white shadow-lg border rounded print:p-0 print:shadow-none print:border-none">
      <div className="flex items-center justify-between mb-4">
        {logo && <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />}
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-blue-900">Assistência Técnica Pro</h1>
          <p className="text-green-700 font-semibold">
            Comprovante de {ordem.status === "Aberta" ? "Entrada" : "Saída"}
          </p>
          <p className="text-gray-500 text-sm">{formatarData(new Date())}</p>
        </div>
      </div>

      <hr className="my-2 border-gray-300" />

      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
        <p><strong>Ordem ID:</strong> {ordem.id}</p>
        <p><strong>Cliente:</strong> {ordem.cliente_nome}</p>
        <p><strong>Equipamento:</strong> {ordem.equipamento}</p>
        <p><strong>Defeito:</strong> {ordem.defeito || "Não informado"}</p>
        <p><strong>Status:</strong> {ordem.status}</p>
        <p><strong>Valor Total:</strong> R$ {valorTotal}</p>
        <p><strong>Data Entrada:</strong> {formatarData(ordem.criado_em)}</p>
        {ordem.status !== "Aberta" && (
          <p><strong>Data Saída:</strong> {ordem.previsao ? formatarData(ordem.previsao) : "-"}</p>
        )}
      </div>

      <hr className="my-2 border-gray-300" />

      <div className="text-xs text-gray-500 mt-2">
        <p>Recebi o equipamento conforme descrito acima.</p>
        <div className="mt-6 flex justify-between">
          <div className="text-center w-1/2">
            __________________________
            <p>Assinatura do Cliente</p>
          </div>
          <div className="text-center w-1/2">
            __________________________
            <p>Assinatura da Assistência</p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Imprimir Comprovante
        </button>
      </div>
    </div>
  );
}
