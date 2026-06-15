import React, { useEffect, useState } from "react";

export default function RelatorioFinanceiro() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/relatorios/financeiro")
      .then((res) => res.json())
      .then((data) => setDados(data))
      .catch((err) => console.error("Erro:", err));
  }, []);

  if (!dados) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Relatório Financeiro</h1>

      <div className="space-y-2">
        <p>Receita: <strong>R$ {dados.receita}</strong></p>
        <p>Despesas: <strong>R$ {dados.despesas}</strong></p>
        <p>Saldo: <strong>R$ {dados.saldo}</strong></p>
      </div>
    </div>
  );
}
