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
    data_fechamento,
    mao_obra = 0
  } = ordem;

  const format = (v) => Number(v || 0).toFixed(2);

  return (
    <div
      id="comprovante-termico"
      style={{
        width: "280px",          // largura segura
        fontFamily: "monospace", // garante alinhamento
        fontSize: "12px",
        padding: "10px",
        background: "white",
        color: "black",
        lineHeight: "1.2"
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
      CPF: {cliente_cpf}<br />
      Abertura: {data_abertura}<br />
      {data_fechamento && <>Fechamento: {data_fechamento}<br /></>}

      <hr />

      <strong>SERVIÇO:</strong><br />
      {descricao}

      <hr />

      <strong>ITENS:</strong><br />

      {itens.length === 0 ? (
        <>Nenhum item adicionado</>
      ) : (
        itens.map((item, index) => (
          <div key={index}>
            {item.nome?.substring(0, 20)} — R$ {format(item.valor)}
          </div>
        ))
      )}

      {mao_obra > 0 && (
        <div style={{ marginTop: "6px" }}>
          Mão de Obra — R$ {format(mao_obra)}
        </div>
      )}

      <hr />

      {/* TOTAL EM UMA ÚNICA LINHA */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          fontWeight: "bold"
        }}
      >
        <span>TOTAL:</span>
        <span>R$ {format(total)}</span>
      </div>

      <hr />

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        Obrigado pela preferência!
      </div>
    </div>
  );
}
