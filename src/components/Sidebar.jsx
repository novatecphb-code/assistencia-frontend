import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Package,
  FileText,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/ordens", label: "Ordens", icon: FileText },
  { to: "/contas-pagar", label: "Contas a Pagar", icon: DollarSign },
  { to: "/contas-receber", label: "Contas a Receber", icon: TrendingUp },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login"; // redireciona
  }

  return (
    <div className="w-64 bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col shadow-lg">

      <div className="p-5 text-2xl font-semibold border-b border-blue-400">
        ⚙️ Painel
      </div>

      {/* Menu principal */}
      <nav className="flex-1 mt-4 space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <motion.div
            key={to}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                pathname === to
                  ? "bg-blue-900 shadow-md"
                  : "hover:bg-blue-600 hover:shadow-sm"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Botão de Logout */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="m-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all shadow-md"
      >
        <LogOut size={18} />
        <span className="font-medium text-sm">Sair</span>
      </motion.button>

    </div>
  );
}
