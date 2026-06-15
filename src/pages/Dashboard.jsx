// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Cronograma from "../components/Cronograma";

export default function Dashboard() {
  const [totais, setTotais] = useState({
    clientes: 0,
    ordens: 0,
    receita: 0,
    despesas: 0
  });

  const [ultimasOrdens, setUltimasOrdens] = useState([]);
  const [ultimosClientes, setUltimosClientes] = useState([]);
  const [cronograma, setCronograma] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const res = await axios.get("http://localhost:3001/api/dashboard-geral");

      setTotais({
        clientes: res.data.clientes,
        ordens: res.data.ordens,
        receita: Number(res.data.receita || 0),
        despesas: Number(res.data.despesas || 0)
      });

      setUltimasOrdens(res.data.ultimasOrdens || []);
      setUltimosClientes(res.data.ultimosClientes || []);
      setCronograma(res.data.cronograma || []);

    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Painel</h1>

      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Clientes</div>
          <div className="text-2xl font-bold">{totais.clientes}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Ordens</div>
          <div className="text-2xl font-bold">{totais.ordens}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Receita</div>
          <div className="text-2xl font-bold text-green-600">
            R$ {totais.receita.toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Despesas</div>
          <div className="text-2xl font-bold text-red-600">
            R$ {totais.despesas.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Últimas ordens + cronograma */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Últimas Ordens */}
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-lg font-semibold mb-3">Últimas Ordens</h2>
          <ul className="space-y-2">
            {ultimasOrdens.map(o => (
              <li key={o.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{o.cliente || "—"}</div>
                  <div className="text-sm text-gray-500">{o.equipamento}</div>
                </div>
                <div className="text-sm text-gray-600">
                  R$ {Number(o.valor || 0).toFixed(2)}
                </div>
              </li>
            ))}

            {ultimasOrdens.length === 0 && (
              <li className="text-gray-500 p-3">Nenhuma ordem recente</li>
            )}
          </ul>
        </div>

        {/* Cronograma */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Cronograma</h2>
          <Cronograma
            events={cronograma.map(item => ({
              id: item.id,
              title: `Ordem #${item.id} - ${item.status}`,
              date: item.previsao,
              status: item.status
            }))}
          />
        </div>
      </div>

      {/* Últimos clientes */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Últimos Clientes</h2>
        <ul>
          {ultimosClientes.map(c => (
            <li key={c.id} className="p-2 border-b">{c.nome}</li>
          ))}

          {ultimosClientes.length === 0 && (
            <div className="text-gray-500 p-2">Nenhum cliente</div>
          )}
        </ul>
      </div>
    </div>
  );
}
