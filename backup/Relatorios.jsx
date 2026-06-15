import React, { useEffect, useState } from "react";
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

export default function Relatorios() {
  const [dados, setDados] = useState({
    totalOrdens: 0,
    concluidas: 0,
    pendentes: 0,
    totalReceber: 0,
    totalRecebido: 0,
    ordensPorMes: [],
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const r = await fetch("http://localhost:3001/api/relatorios/geral");
      const json = await r.json();
      setDados(json);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }

  const pieData = [
    { name: "Concluídas", value: dados.concluidas },
    { name: "Pendentes", value: dados.pendentes },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Relatórios</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-600 text-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total de Ordens</h2>
          <p className="text-3xl font-bold mt-2">{dados.totalOrdens}</p>
        </div>

        <div className="bg-green-600 text-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Concluídas</h2>
          <p className="text-3xl font-bold mt-2">{dados.concluidas}</p>
        </div>

        <div className="bg-yellow-500 text-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Pendentes</h2>
          <p className="text-3xl font-bold mt-2">{dados.pendentes}</p>
        </div>

        <div className="bg-purple-600 text-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Recebido</h2>
          <p className="text-3xl font-bold mt-2">R$ {dados.totalRecebido}</p>
        </div>

        <div className="bg-red-600 text-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold">A Receber</h2>
          <p className="text-3xl font-bold mt-2">R$ {dados.totalReceber}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gráfico de Barras */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Ordens por mês</h2>
          <BarChart width={450} height={280} data={dados.ordensPorMes}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </div>

        {/* Gráfico de Pizza */}
        <div className="bg-white p-6 shadow rounded-lg">
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
              <Cell fill="#10b981" />
              <Cell fill="#f59e0b" />
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
