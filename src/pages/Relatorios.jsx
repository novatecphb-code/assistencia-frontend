import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import jsPDF from "jspdf";

export default function Relatorios() {
  const [dados, setDados] = useState({
    totalOrdens: 0,
    concluidas: 0,
    pendentes: 0,
    totalReceber: 0,
    totalRecebido: 0,
    ordensPorMes: [],
  });

  const barChartRef = useRef();
  const pieChartRef = useRef();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const r = await fetch("http://localhost:3001/api/relatorios/geral");
      const json = await r.json();
      setDados({
        totalOrdens: json.totalOrdens || 0,
        concluidas: json.concluidas || 0,
        pendentes: json.pendentes || 0,
        totalReceber: json.totalReceber || 0,
        totalRecebido: json.totalRecebido || 0,
        ordensPorMes: json.ordensPorMes || [],
      });
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }

  const pieData = [
    { name: "Concluídas", value: dados.concluidas },
    { name: "Pendentes", value: dados.pendentes },
  ];

  const COLORS = ["#10b981", "#f59e0b"]; // Verde para concluidas, laranja para pendentes

  // Converte SVG do gráfico em PNG
  const svgToImage = (svgElement, width, height) => {
    return new Promise((resolve) => {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };

      img.src = url;
    });
  };

  const gerarPDF = async () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 50;

    // Título
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório Financeiro", pageWidth / 2, y, { align: "center" });
    y += 40;

    // Cards
    const cards = [
      { title: "Total de Ordens", value: dados.totalOrdens, color: "#3b82f6" },
      { title: "Concluídas", value: dados.concluidas, color: "#10b981" },
      { title: "Pendentes", value: dados.pendentes, color: "#f59e0b" },
      { title: "Total Recebido", value: `R$ ${Number(dados.totalRecebido).toFixed(2)}`, color: "#8b5cf6" },
      { title: "A Receber", value: `R$ ${Number(dados.totalReceber).toFixed(2)}`, color: "#ef4444" },
    ];

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    cards.forEach((card) => {
      doc.setFillColor(card.color);
      doc.rect(40, y - 12, pageWidth - 80, 20, "F");
      doc.setTextColor("#ffffff");
      doc.text(card.title, 45, y);
      doc.text(String(card.value), pageWidth - 45, y, { align: "right" });
      doc.setTextColor("#000000");
      y += 30;
    });

    y += 10;

    // Legenda do gráfico de pizza
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(16, 185, 129); // verde
    doc.rect(40, y, 10, 10, "F");
    doc.text("Concluídas", 55, y + 10);

    doc.setFillColor(245, 158, 11); // laranja
    doc.rect(140, y, 10, 10, "F");
    doc.text("Pendentes", 155, y + 10);
    y += 30;

    // Gráfico de barras
    if (barChartRef.current) {
      const svg = barChartRef.current.querySelector("svg");
      if (svg) {
        const img = await svgToImage(svg, 600, 350);
        if (y + 360 > pageHeight) {
          doc.addPage();
          y = 40;
        }
        doc.addImage(img, "PNG", 40, y, pageWidth - 80, 260);
        y += 300;
      }
    }

    // Gráfico de pizza
    if (pieChartRef.current) {
      const svg = pieChartRef.current.querySelector("svg");
      if (svg) {
        const img = await svgToImage(svg, 450, 350);
        if (y + 360 > pageHeight) {
          doc.addPage();
          y = 40;
        }
        doc.addImage(img, "PNG", 40, y, pageWidth - 80, 260);
        y += 300;
      }
    }

    // Rodapé
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 40, pageHeight - 30);

    doc.save("relatorio_financeiro.pdf");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold border-b pb-2 mb-6">Relatórios</h1>

      <button
        onClick={() => window.history.back()}
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        ← Voltar
      </button>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-600 text-white p-5 rounded-lg shadow-lg border-2 border-blue-400">
          <h2 className="text-lg font-semibold">Total de Ordens</h2>
          <p className="text-3xl font-bold mt-2">{dados.totalOrdens}</p>
        </div>
        <div className="bg-green-600 text-white p-5 rounded-lg shadow-lg border-2 border-green-400">
          <h2 className="text-lg font-semibold">Concluídas</h2>
          <p className="text-3xl font-bold mt-2">{dados.concluidas}</p>
        </div>
        <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-lg border-2 border-yellow-400">
          <h2 className="text-lg font-semibold">Pendentes</h2>
          <p className="text-3xl font-bold mt-2">{dados.pendentes}</p>
        </div>
        <div className="bg-purple-600 text-white p-5 rounded-lg shadow-lg border-2 border-purple-400">
          <h2 className="text-lg font-semibold">Total Recebido</h2>
          <p className="text-3xl font-bold mt-2">R$ {Number(dados.totalRecebido).toFixed(2)}</p>
        </div>
        <div className="bg-red-600 text-white p-5 rounded-lg shadow-lg border-2 border-red-400">
          <h2 className="text-lg font-semibold">A Receber</h2>
          <p className="text-3xl font-bold mt-2">R$ {Number(dados.totalReceber).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-6">
        <div ref={barChartRef} className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Ordens por mês</h2>
          <BarChart width={500} height={280} data={dados.ordensPorMes}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </div>

        <div ref={pieChartRef} className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Status das Ordens</h2>
          <PieChart width={350} height={280}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={gerarPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Gerar PDF
        </button>
      </div>
    </div>
  );
}
