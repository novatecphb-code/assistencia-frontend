import { useNavigate } from "react-router-dom";

export default function VoltarButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
    >
      ⬅ Voltar
    </button>
  );
}
