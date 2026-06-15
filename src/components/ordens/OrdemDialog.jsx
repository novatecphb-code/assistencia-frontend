import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function OrdemDialog({ open, onOpenChange, ordem }) {
  if (!ordem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Itens da OS #{ordem.id}</DialogTitle>
        </DialogHeader>

        {ordem.itens?.length === 0 && (
          <p className="text-gray-500">Nenhum item cadastrado.</p>
        )}

        {ordem.itens?.map((it) => (
          <div key={it.id} className="p-2 border rounded-lg mb-2">
            <p className="font-semibold">{it.produto_nome}</p>
            <p>Qtd: {it.quantidade}</p>
            <p>Total: R$ {it.total_item}</p>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
