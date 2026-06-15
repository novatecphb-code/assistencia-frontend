import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import Recibo from "@/components/recibo/Recibo";

export default function ReciboPage() {
  const { id } = useParams();
  const [ordem, setOrdem] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await api.get(`/ordens/${id}`);
      const data = res.data.data || res.data;
      setOrdem(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!ordem) return <div>Carregando...</div>;

  return <Recibo ordem={ordem} />;
}