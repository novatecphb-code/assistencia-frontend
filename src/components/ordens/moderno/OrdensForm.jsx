import { useState, useEffect } from "react";
import api from "@/services/api";

export default function OrdensForm({
  ordemSelecionada,
  fecharForm,
  carregarOrdens,
}) {
  const [step, setStep] = useState(1);

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [buscaCliente, setBuscaCliente] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);

  const [form, setForm] = useState({
    cliente_id: "",
    equipamento: "",
    defeito: "",
    status: "Pendente",
    mao_obra: 0,
  });

  const [itens, setItens] = useState([]);

  /* ================== CARREGAR DADOS ================== */
  useEffect(() => {
    carregarClientes();
    carregarProdutos();
  }, []);

  async function carregarClientes() {
    const res = await api.get("/clientes");
    setClientes(res.data.data ?? res.data);
  }

  async function carregarProdutos() {
    const res = await api.get("/produtos");
    setProdutos(res.data.data ?? res.data);
  }

  /* ================== EDITAR ================== */
  useEffect(() => {
    if (!ordemSelecionada) return;

    setForm({
      cliente_id: ordemSelecionada.cliente_id || "",
      equipamento: ordemSelecionada.equipamento || "",
      defeito: ordemSelecionada.defeito || "",
      status: ordemSelecionada.status || "Pendente",
      mao_obra: ordemSelecionada.mao_obra || 0,
    });

    setItens(
      (ordemSelecionada.itens || []).map((i) => ({
        ...i,
        total_item: Number(i.total_item ?? 0),
      }))
    );

    setStep(2);
  }, [ordemSelecionada]);

  useEffect(() => {
    if (!ordemSelecionada || clientes.length === 0) return;

    const cliente = clientes.find(
      (c) => c.id === ordemSelecionada.cliente_id
    );

    if (cliente) {
      setBuscaCliente(cliente.nome);
      setForm((prev) => ({ ...prev, cliente_id: cliente.id }));
    }
  }, [clientes]);

  /* ================== FORM ================== */
  function atualizarCampo(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function selecionarCliente(c) {
    setForm({ ...form, cliente_id: c.id });
    setBuscaCliente(c.nome);
    setMostrarLista(false);
  }

  /* ================== ITENS ================== */
  function adicionarItem() {
    setItens([
      ...itens,
      { produto_id: "", quantidade: 1, valor_unitario: 0, total_item: 0 },
    ]);
  }

  function atualizarItem(index, campo, valor) {
    const novos = [...itens];
    novos[index][campo] = valor;

    if (campo === "produto_id") {
      const produto = produtos.find((p) => p.id == valor);
      novos[index].valor_unitario = Number(produto?.preco ?? 0);
    }

    novos[index].total_item =
      Number(novos[index].quantidade ?? 0) *
      Number(novos[index].valor_unitario ?? 0);

    setItens(novos);
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  /* ================== TOTAIS ================== */
  const totalItens = itens.reduce(
    (acc, i) => acc + Number(i.total_item ?? 0),
    0
  );

  const totalGeral = Number(totalItens) + Number(form.mao_obra ?? 0);

  /* ================== SALVAR ================== */
  async function salvar() {
    try {
      const payload = {
        ...form,
        mao_obra: Number(form.mao_obra ?? 0),
        itens: itens.filter((i) => i.produto_id),
      };

      if (ordemSelecionada) {
        await api.put(`/ordens/${ordemSelecionada.id}`, payload);
      } else {
        await api.post("/ordens", payload);
      }

      carregarOrdens();
      fecharForm();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar ordem.");
    }
  }

  /* ================== UI ================== */
  return (
    <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">
        {ordemSelecionada ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
      </h2>

      <div className="flex justify-between mb-6">
        {["Cliente", "Equipamento", "Itens", "Resumo"].map((t, i) => (
          <div
            key={i}
            className={`w-1/4 text-center py-2 border-b-4 ${
              step === i + 1
                ? "border-blue-600 font-bold"
                : "border-gray-300"
            }`}
          >
            {t}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <label className="font-semibold">Buscar Cliente</label>
          <input
            className="w-full border p-2 mb-2 rounded"
            value={buscaCliente}
            onChange={(e) => {
              setBuscaCliente(e.target.value);
              setMostrarLista(true);
            }}
          />

          {mostrarLista && (
            <div className="border rounded shadow max-h-40 overflow-y-auto mb-4">
              {clientes
                .filter((c) =>
                  c.nome.toLowerCase().includes(buscaCliente.toLowerCase())
                )
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => selecionarCliente(c)}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {c.nome}
                  </div>
                ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!form.cliente_id}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 disabled:bg-gray-400"
          >
            Próximo
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <input
            name="equipamento"
            placeholder="Equipamento"
            className="w-full border p-2 rounded"
            value={form.equipamento}
            onChange={atualizarCampo}
          />

          <input
            name="defeito"
            placeholder="Defeito"
            className="w-full border p-2 rounded"
            value={form.defeito}
            onChange={atualizarCampo}
          />

          <select
            name="status"
            className="w-full border p-2 rounded"
            value={form.status}
            onChange={atualizarCampo}
          >
            <option>Pendente</option>
            <option>Em Análise</option>
            <option>Aguardando Peça</option>
            <option>Concluída</option>
          </select>

          <input
            name="mao_obra"
            type="number"
            placeholder="Mão de obra"
            className="w-full border p-2 rounded"
            value={form.mao_obra}
            onChange={atualizarCampo}
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          {itens.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-2 mb-2"
            >
              <select
                className="border p-2 rounded"
                value={item.produto_id}
                onChange={(e) =>
                  atualizarItem(index, "produto_id", e.target.value)
                }
              >
                <option value="">Produto...</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="border p-2 rounded"
                value={item.quantidade}
                onChange={(e) =>
                  atualizarItem(index, "quantidade", e.target.value)
                }
              />

              <input
                disabled
                className="border p-2 bg-gray-100 rounded"
                value={`R$ ${Number(item.total_item).toFixed(2)}`}
              />

              <button
                type="button"
                onClick={() => removerItem(index)}
                className="bg-red-500 text-white rounded"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={adicionarItem}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          >
            + Adicionar Item
          </button>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div>
          <div className="font-bold text-right mb-4">
            Total: R$ {totalGeral.toFixed(2)}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={salvar}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Salvar OS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
