import React, { useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Comprovante = forwardRef(({ ordem }, ref) => {
  const comprovanteRef = useRef();

  if (!ordem) return null;

  const formatValor = (v) => {
    const num = Number(v);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const calcularTotalItens = () => {
    return ordem.itens.reduce((acc, i) => acc + Number(i.total_item || 0), 0);
  };

  const calcularTotal = () => {
    return calcularTotalItens() + Number(ordem.mao_obra || 0);
  };

  useImperativeHandle(ref, () => ({
    gerarPDF: async () => {
      if (!comprovanteRef.current) return;

      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(comprovanteRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`comprovante_OS_${ordem.id}.pdf`);
    },
  }));

  return (
    <div
      ref={comprovanteRef}
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
        color: "#111",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Cabeçalho */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#2563eb" }}>
          Comprovante de Ordem de Serviço
        </h2>
        <p style={{ fontSize: "12px", color: "#555" }}>OS #{ordem.id}</p>
      </div>

      {/* Dados do Cliente */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "12px",
        }}
      >
        <p><strong>Cliente:</strong> {ordem.cliente_nome}</p>
        <p><strong>Equipamento:</strong> {ordem.equipamento}</p>
        <p><strong>Defeito:</strong> {ordem.defeito}</p>
        <p><strong>Status:</strong> {ordem.status}</p>
        <p><strong>Data:</strong> {new Date(ordem.criado_em).toLocaleDateString("pt-BR")}</p>
      </div>

      {/* Tabela de Itens com linha zebra */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr style={{ backgroundColor: "#e5e7eb" }}>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Produto</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Qtd</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {ordem.itens.map((i, index) => (
            <tr key={i.id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{i.produto_nome}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "center" }}>{i.quantidade}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "right" }}>R$ {formatValor(i.total_item)}</td>
            </tr>
          ))}
          {ordem.mao_obra > 0 && (
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "6px", fontWeight: "bold" }}>Mão de Obra</td>
              <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "center" }}>1</td>
              <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "right" }}>R$ {formatValor(ordem.mao_obra)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Geral */}
      <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px", marginTop: "12px" }}>
        Total Geral: R$ {formatValor(calcularTotal())}
      </div>

      {/* Rodapé */}
      <div style={{ textAlign: "center", fontStyle: "italic", fontSize: "12px", marginTop: "12px", color: "#555" }}>
        Obrigado pela preferência! <br />
        Emitido em: {new Date().toLocaleString("pt-BR")}
      </div>
    </div>
  );
});

export default Comprovante;
