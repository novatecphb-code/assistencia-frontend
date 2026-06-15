export default function RelatorioGeral({ dados }) {
  return (
    <div className="card">
      <h3>Relatório Geral</h3>

      <p>Total de ordens: {dados.totalOrdens}</p>
      <p>Concluídas: {dados.concluidas}</p>
      <p>Pendentes: {dados.pendentes}</p>
    </div>
  );
}
