// src/components/ComprovanteTermico.jsx
import React from "react";

export default function ComprovanteTermico({ ordem }) {
  if (!ordem) return null;

  const {
    id,
    cliente_nome,
    cliente_cpf,
    descricao,
    total,
    itens = [],
    data_abertura,
    data_fechamento
  } = ordem;

  return (
    <div
      id="comprovante-termico"
      style={{
        width: "280px", // Largura aproximada de bobina 80mm
        fontFamily: "monospace",
        fontSize: "12px",
        padding: "10px",
        background: "white",
        color: "black"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <strong>ASSISTÊNCIA TÉCNICA</strong>
        <br />
        CNPJ: 00.000.000/0001-00
        <br />
        Tel: (00) 00000-0000
      </div>

      <hr />

      <strong>ORDEM #: {id}</strong>
      <br />
      Cliente: {cliente_nome}
      <br />
      CPF: {cliente_cpf}
      <br />
      Abertura: {data_abertura}
      <br />
      {data_fechamento && <>Fechamento: {data_fechamento}<br /></>}

      <hr />

      <strong>SERVIÇO:</strong>
      <br />
      {descricao}

      <hr />

      <strong>ITENS:</strong>
      <br />
      {itens.length === 0 ? (
        <>Nenhum item adicionado</>
      ) : (
        itens.map((item, index) => (
          <div key={index}>
            {item.nome} — R$ {item.valor}
          </div>
        ))
      )}

      <hr />

      <div style={{ textAlign: "right", fontSize: "14px" }}>
        <strong>TOTAL: R$ {total}</strong>
      </div>

      <hr />

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        Obrigado pela preferência!
      </div>
    </div>
  );
}
