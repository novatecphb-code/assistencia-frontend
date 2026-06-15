// src/components/Menu.jsx
import { NavLink } from "react-router-dom";
import { Home, Users, Box, FileText, DollarSign } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <Home size={20} /> },
  { name: "Clientes", path: "/clientes", icon: <Users size={20} /> },
  { name: "Produtos", path: "/produtos", icon: <Box size={20} /> },
  { name: "Ordens de Serviço", path: "/ordens", icon: <FileText size={20} /> },
  { name: "Financeiro", path: "/financeiro", icon: <DollarSign size={20} /> },
];

export default function Menu() {
  return (
    <nav className="bg-gray-800 text-white w-64 h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Sistema</h2>
      <ul className="space-y-2 flex-1">
        {menuItems.map(item => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition ${
                  isActive ? "bg-green-600 font-semibold" : ""
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
