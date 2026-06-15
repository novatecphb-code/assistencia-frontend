import React, { useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Recibo from "./Recibo";

const ReciboPDF = forwardRef(({ ordem }, ref) => {
  const reciboRef = useRef(null);

  useImperativeHandle(ref, () => ({
    gerarPDF: async () => {
      if (!reciboRef.current) return;

      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(reciboRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`recibo_OS_${ordem.id}.pdf`);
    },
  }));

  return (
    <div ref={reciboRef}>
      <Recibo ordem={ordem} />
    </div>
  );
});

export default ReciboPDF;
