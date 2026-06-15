import { Outlet, useNavigate } from "react-router-dom";
export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex">
      {/* ===== MENU LATERAL ===== */}
      <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col shadow-lg">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          Assistência Técnica Pro
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full text-left py-2 px-4 hover:bg-blue-800 rounded"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/clientes")}
            className="w-full text-left py-2 px-4 hover:bg-blue-800 rounded"
          >
            Clientes
          </button>

          <button
            onClick={() => navigate("/produtos")}
            className="w-full text-left py-2 px-4 hover:bg-blue-800 rounded"
          >
            Produtos
          </button>

          <button
            onClick={() => navigate("/ordens")}
            className="w-full text-left py-2 px-4 hover:bg-blue-800 rounded"
          >
            Ordens de Serviço
          </button>

          <button
            onClick={() => navigate("/financeiro")}
            className="w-full text-left py-2 px-4 hover:bg-blue-800 rounded"
          >
            Financeiro
          </button>
        </nav>

        <div className="p-4 border-t border-blue-800 text-sm text-blue-300">      
     
v9 Adriano Gonçalves
        </div>
      </aside>

      {/* ===== ÁREA PRINCIPAL (muda conforme a página) ===== */}
      <main className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
}
