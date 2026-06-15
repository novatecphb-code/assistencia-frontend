import "./recibo.css";

export default function Recibo({ ordem }) {
  if (!ordem) return null;

  const total = Number(ordem.totalOrdem || 0);
  const numeroOS = String(ordem.id || 0).padStart(6, "0");

  const data = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="recibo nf" id="recibo-pdf">

      {/* HEADER */}
      <div className="nf-header">
        <div>
          <strong>ADRIANO DA COSTA GONÇALVES</strong><br />
          Técnico em Informática
        </div>

        <div className="nf-info">
          CPF: 996.829.073-49<br />
          Parnaíba - PI
        </div>
      </div>

      {/* TÍTULO */}
      <div className="nf-title">
        <span>RECIBO DE SERVIÇO</span>
        <span>Nº {numeroOS}</span>
      </div>

      {/* CLIENTE */}
      <div className="nf-cliente">
        <strong>Cliente:</strong> {ordem.cliente_nome}
      </div>

      {/* DESCRIÇÃO */}
      <div className="nf-descricao">
        <strong>Descrição:</strong> {ordem.descricao_servico}
      </div>

      {/* TABELA */}
      <table className="nf-tabela">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor (R$)</th>
          </tr>
        </thead>
        <tbody>

          {ordem.itens?.map((item, i) => (
            <tr key={i}>
              <td>{item.produto_nome}</td>
              <td>R$ {Number(item.total_item).toFixed(2)}</td>
            </tr>
          ))}

          {Number(ordem.mao_obra) > 0 && (
            <tr>
              <td>Mão de obra</td>
              <td>R$ {Number(ordem.mao_obra).toFixed(2)}</td>
            </tr>
          )}

        </tbody>
      </table>

      {/* TOTAL */}
      <div className="nf-total">
        TOTAL: R$ {total.toFixed(2)}
      </div>

      {/* DATA */}
      <div className="nf-data">
        Parnaíba, {data}
      </div>

      {/* ASSINATURA */}
      <div className="nf-assinatura">
        _________________________________<br />
        ADRIANO DA COSTA GONÇALVES
      </div>

    </div>
  );
}