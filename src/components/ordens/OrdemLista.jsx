import { Button } from "@/components/ui/button";

export default function OrdemLista({ ordens, onEdit, onDelete, onOpen }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Lista de Ordens</h3>

      {ordens.length === 0 && (
        <p className="text-gray-500">Nenhuma ordem cadastrada.</p>
      )}

      {ordens.map((os) => (
        <div
          key={os.id}
          className="p-3 border rounded-xl flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">OS #{os.id} – {os.cliente_nome}</p>
            <p className="text-sm text-gray-500">{os.equipamento}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onOpen(os)} variant="secondary">
              Itens
            </Button>

            <Button onClick={() => onEdit(os)} variant="default">
              Editar
            </Button>

            <Button onClick={() => onDelete(os.id)} variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
