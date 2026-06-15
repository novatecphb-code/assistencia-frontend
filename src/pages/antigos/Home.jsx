import { Link } from "react-router-dom";
import {
  FaUsers,
  FaShoppingCart,
  FaClipboardList,
  FaMoneyBillWave,
  FaFileInvoice,
  FaRegCreditCard,
  FaRegMoneyBillAlt
} from "react-icons/fa";

export default function Home() {
  const modules = [
    {
      name: "Clientes",
      icon: <FaUsers size={28} />,
      link: "/clientes",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Produtos",
      icon: <FaShoppingCart size={28} />,
      link: "/produtos",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Ordens",
      icon: <FaClipboardList size={28} />,
      link: "/ordens-servico",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      name: "Financeiro",
      icon: <FaMoneyBillWave size={28} />,
      link: "/financeiro",
      color: "bg-yellow-500 hover:bg-yellow-600 text-black",
    },
    {
      name: "Relatórios",
      icon: <FaFileInvoice size={28} />,
      link: "/relatorios",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      name: "Contas a Pagar",
      icon: <FaRegCreditCard size={28} />,
      link: "/contas-pagar",
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      name: "Contas a Receber",
      icon: <FaRegMoneyBillAlt size={28} />,
      link: "/contas-receber",
      color: "bg-teal-500 hover:bg-teal-600",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Sistema</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map((m) => (
          <Link
            key={m.name}
            to={m.link}
            className={`${m.color} text-white rounded-xl p-6 shadow-lg
              flex flex-col items-center justify-center gap-3 
              transition-all hover:scale-105`}
          >
            {m.icon}
            <span className="text-xl font-semibold">{m.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
