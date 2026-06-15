import React from "react";

export default function OrdemServicoComprovante({ ordem }) {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial", width: "400px" }}>
      <h2 style={{ textAlign: "center" }}>Comprovante de Ordem de Serviço</h2>
      <hr />
      <p><strong>ID:</strong> {ordem.id}</p>
      <p><strong>Cliente:</strong> {ordem.cliente_nome}</p>
      <p><strong>Equipamento:</strong> {ordem.equipamento}</p>
      <p><strong>Status:</strong> {ordem.status}</p>
      <p><strong>Valor:</strong> R$ {ordem.valor_total}</p>
      <p><strong>Data:</strong> {new Date(ordem.data).toLocaleDateString()}</p>
      <hr />
      <p style={{ textAlign: "center" }}>Produto devolvido/reparado com sucesso</p>
    </div>
  );
}
