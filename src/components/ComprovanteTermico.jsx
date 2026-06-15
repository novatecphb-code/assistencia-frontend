// src/components/ComprovanteTermico.jsx
import React from "react";

export default function ComprovanteTermico({ ordem }) {
  if (!ordem) return null;

  const {
    id,
    cliente_nome,
    cliente_cpf,
    defeito,
    itens = [],
    mao_obra = 0,
    valor_total,
    criado_em
  } = ordem;

  const format = (v) => Number(v || 0).toFixed(2);

  const formatData = (data) => {
    if (!data) return "—";
    return new Date(data).toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    });
  };

  return (
    <div
      id="comprovante-termico"
      style={{
        width: "280px",
        fontFamily: "monospace",
        fontSize: "12px",
        padding: "10px",
        background: "white",
        color: "black",
        lineHeight: "1.2",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <strong>ASSISTÊNCIA TÉCNICA</strong><br />
        CNPJ: 00.000.000/0001-00<br />
        Tel: (00) 00000-0000
      </div>

      <hr />

      <strong>ORDEM #: {id}</strong><br />
      Cliente: {cliente_nome}<br />
      CPF: {cliente_cpf || "Não informado"}<br />
      Abertura: {formatData(criado_em)}<br />

      <hr />

      <strong>SERVIÇO:</strong><br />
      {defeito || "Sem descrição"}<br />
      {mao_obra > 0 && (
        <>Valor Serviço — R$ {format(mao_obra)}<br /></>
      )}

      <hr />

      <strong>ITENS:</strong><br />

      {itens.length === 0 ? (
        <>Nenhum item adicionado</>
      ) : (
        itens.map((item, index) => (
          <div key={index}>
            {item.produto_nome?.substring(0, 20)} — R$ {format(item.total_item)}
          </div>
        ))
      )}

      <hr />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        <span>TOTAL:</span>
        <span>R$ {format(valor_total)}</span>
      </div>

      <hr />

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        Obrigado pela preferência!
      </div>
    </div>
  );
}
