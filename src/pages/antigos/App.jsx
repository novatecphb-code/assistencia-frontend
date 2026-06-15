import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Ordens from "./pages/OrdensServico";
import OrdensServico from "./pages/OrdensServico";
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import RelatorioFinanceiro from "./pages/RelatorioFinanceiro";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      {token && (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold">Sistema ADR</h3>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>
      )}

      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login setToken={setToken} />} />

        {/* Home */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Páginas do sistema */}
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />

        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <Produtos />
            </PrivateRoute>
          }
        />

        <Route
          path="/ordens"
          element={
            <PrivateRoute>
              <Ordens />
            </PrivateRoute>
          }
        />

        <Route
          path="/ordens-servico"
          element={
            <PrivateRoute>
              <OrdensServico />
            </PrivateRoute>
          }
        />

        <Route
          path="/financeiro"
          element={
            <PrivateRoute>
              <Financeiro />
            </PrivateRoute>
          }
        />

        <Route
          path="/contas-pagar"
          element={
            <PrivateRoute>
              <ContasPagar />
            </PrivateRoute>
          }
        />

        <Route
          path="/contas-receber"
          element={
            <PrivateRoute>
              <ContasReceber />
            </PrivateRoute>
          }
        />

        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Relatorios />
            </PrivateRoute>
          }
        />

        <Route
          path="/relatorio-financeiro"
          element={
            <PrivateRoute>
              <RelatorioFinanceiro />
            </PrivateRoute>
          }
        />

        {/* Caso rota não exista */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
