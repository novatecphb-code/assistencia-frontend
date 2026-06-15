import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrdemForm({ ordem, onSubmit }) {
  const [form, setForm] = useState({
    cliente_id: "",
    equipamento: "",
    defeito: "",
    status: "Pendente",
    valor_total: 0,
    mao_obra: 0,
    previsao: "",
    itens: []
  });

  useEffect(() => {
    if (ordem) setForm(ordem);
  }, [ordem]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    onSubmit(form);
    setForm({
      cliente_id: "",
      equipamento: "",
      defeito: "",
      status: "Pendente",
      valor_total: 0,
      mao_obra: 0,
      previsao: "",
      itens: []
    });
  }

  return (
    <form onSubmit={enviar} className="space-y-3">
      <Input
        name="cliente_id"
        placeholder="ID do Cliente"
        value={form.cliente_id}
        onChange={handleChange}
      />

      <Input
        name="equipamento"
        placeholder="Equipamento"
        value={form.equipamento}
        onChange={handleChange}
      />

      <Input
        name="defeito"
        placeholder="Defeito"
        value={form.defeito}
        onChange={handleChange}
      />

      <Input
        name="status"
        placeholder="Status"
        value={form.status}
        onChange={handleChange}
      />

      <Input
        name="mao_obra"
        placeholder="Mão de Obra"
        value={form.mao_obra}
        onChange={handleChange}
      />

      <Input
        name="valor_total"
        placeholder="Valor Total"
        value={form.valor_total}
        onChange={handleChange}
      />

      <Input
        name="previsao"
        placeholder="Previsão"
        value={form.previsao}
        onChange={handleChange}
      />

      <Button type="submit" className="w-full">
        Salvar
      </Button>
    </form>
  );
}
