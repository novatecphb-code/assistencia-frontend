console.log("CARREGOU SPLASH");

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // 3 segundos
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-800 text-white">
      <img src={logo} alt="Logo" className="w-24 mb-4 animate-bounce" />
      <h1 className="text-3xl font-bold">Assistência Técnica Pro</h1>
      <p className="mt-2 text-sm opacity-70">Carregando...</p>
    </div>
  );
};

export default SplashScreen;
