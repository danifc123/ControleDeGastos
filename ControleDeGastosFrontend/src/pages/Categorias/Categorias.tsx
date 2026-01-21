import { useEffect, useMemo, useState } from "react";
import type { Categoria } from "../../types";
import { apiGet } from "../../services/api";
import CategoriaForm from "../../components/Categoria/CategoriaForm";
import CategoriaTable from "../../components/Categoria/CategoriaTable";
import AlertModal from "../../components/AlertModal/AlertModal";
import "./Categorias.css";

function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const apiBaseUrl = useMemo(() => import.meta.env.VITE_API_BASE_URL as string, []);

  async function fetchCategorias() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Categoria[]>("/api/categoria");
      setCategorias(data);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar categorias";
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategorias();
  }, []);

  function handleError(message: string) {
    setError(message || null);
    if (message) {
      setShowErrorModal(true);
    }
  }

  return (
    <div className="categoriasPage">
      <header className="sectionHeader">
        <div>
          <p className="eyebrow">Categorias</p>
          <h1>Gerencie categorias cadastradas</h1>
          <p className="subtitle">
            API base: <strong>{apiBaseUrl}</strong>
          </p>
        </div>
      </header>

      <CategoriaForm onCreated={fetchCategorias} onError={handleError} />

      {loading && <p>Carregando categorias...</p>}

      {!loading && (
        <CategoriaTable categorias={categorias} onDeleted={fetchCategorias} onError={handleError} />
      )}

      <AlertModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setError(null);
        }}
        title="Erro"
        message={error || "Ocorreu um erro inesperado"}
        type="error"
      />
    </div>
  );
}

export default CategoriasPage;

