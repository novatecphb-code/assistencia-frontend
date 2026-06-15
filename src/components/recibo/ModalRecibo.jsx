import Recibo from "./Recibo";

export default function ModalRecibo({ ordem, onClose }) {
  if (!ordem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">

        {/* CONTEÚDO IMPRIMÍVEL */}
        <Recibo ordem={ordem} />

        {/* AÇÕES */}
        <div className="mt-4 flex justify-end gap-2 no-print">
          <button onClick={() => window.print()}>
            Imprimir
          </button>

          <button onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
