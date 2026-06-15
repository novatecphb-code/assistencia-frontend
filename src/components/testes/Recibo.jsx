import React from "react";

export default function Recibo({ ordem }) {
  if (!ordem) return null;

  const formatValor = (v) => {
    const num = Number(v);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const totalItens = ordem.itens.reduce(
    (acc, i) => acc + Number(i.total_item || 0),
    0
  );

  const totalGeral = totalItens + Number(ordem.mao_obra || 0);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#fff",
        color: "#111",
      }}
    >
      {/* CABEÇALHO DA EMPRESA */}
      <div className="text-center text-xs leading-4">
        <h2 className="font-bold text-sm">ADRIANO GONÇALVES</h2>
        <p>Assistência Técnica em Equipamentos de Informática</p>
        <p>Rua Anísio Neves, 214 – Boa Esperança I</p>
        <p>Parnaíba - PI • CEP 64215-480</p>
        <p>Email: novatecphb@gmail.com</p>
        <p>CPF: 996.829.073-49</p>
      </div>

      <hr className="border-black" />

      {/* TÍTULO */}
      <h3 className="text-center font-bold">RECIBO</h3>

      {/* TEXTO */}
      <p>
        Valor: <strong>R$ {formatValor(totalGeral)}</strong>
      </p>

      <p>
        Recebi de <strong>{ordem.cliente_nome}</strong> a importância de{" "}
        <strong>R$ {formatValor(totalGeral)}</strong>, referente aos serviços
        descritos abaixo:
      </p>

      {/* TABELA */}
      <table className="w-full border border-black border-collapse text-xs">
        <thead>
          <tr>
            <th className="border border-black px-2 py-1">Serviço</th>
            <th className="border border-black px-2 py-1">Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          {ordem.itens.map((i) => (
            <tr key={i.id}>
              <td className="border border-black px-2 py-1">
                {i.produto_nome}
              </td>
              <td className="border border-black px-2 py-1 text-right">
                {formatValor(i.total_item)}
              </td>
            </tr>
          ))}

          {ordem.mao_obra > 0 && (
            <tr>
              <td className="border border-black px-2 py-1">Mão de obra</td>
              <td className="border border-black px-2 py-1 text-right">
                {formatValor(ordem.mao_obra)}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* TOTAL */}
      <p className="text-right font-bold">
        Valor total: R$ {formatValor(totalGeral)}
      </p>

      {/* DATA */}
      <p>Parnaíba, {new Date().toLocaleDateString("pt-BR")}</p>

      {/* ASSINATURA */}
      <div className="text-center mt-10">
        <hr className="w-64 mx-auto mb-2" />
        <p>ADRIANO DA COSTA GONÇALVES</p>
      </div>
    </div>
  );
}
