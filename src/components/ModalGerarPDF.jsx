import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Comprovante from "../Comprovante";

export default function ModalGerarPDF({ ordem, onClose }) {
  const printRef = useRef();

  async function gerarPDF() {
    try {
      const element = printRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.save(`ordem_${ordem.id}.pdf`);
      onClose();
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar PDF. Veja o console.");
    }
  }

  useEffect(() => {
    setTimeout(() => gerarPDF(), 500);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-4 rounded shadow-xl w-[320px] text-center">
        <h2 className="font-semibold text-lg mb-3">Gerando PDF...</h2>

        {/* ÁREA OCULTA COM O COMPROVANTE */}
        <div className="hidden">
          <div ref={printRef}>
            <Comprovante ordem={ordem} pdfMode />
          </div>
        </div>

        <p>Aguarde um instante...</p>
      </div>
    </div>
  );
}
