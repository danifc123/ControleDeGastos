import { useEffect, useMemo, useState } from "react";
import type { Pessoa } from "../../types";
import { apiGet } from "../../services/api";

import "./Pessoas.css";
import PessoaForm from "../../components/Pessoa/PessoaForm";
import PessoaTable from "../../components/Pessoa/PessoaTable";
import AlertModal from "../../components/AlertModal/AlertModal";

function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const apiBaseUrl = useMemo(() => import.meta.env.VITE_API_BASE_URL as string, []);

  async function fetchPessoas() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Pessoa[]>("/api/pessoa");
      setPessoas(data);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar pessoas";
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPessoas();
  }, []);

  function handleError(message: string) {
    setError(message || null);
    if (message) {
      setShowErrorModal(true);
    }
  }

  return (
    <div className="pessoasPage">
      <header className="sectionHeader">
        <div>
          <p className="eyebrow">Pessoas</p>
          <h1>Gerencie pessoas cadastradas</h1>
          <p className="subtitle">
            API base: <strong>{apiBaseUrl}</strong>
          </p>
        </div>
      </header>

      <PessoaForm onCreated={fetchPessoas} onError={handleError} />

      {loading && <p>Carregando pessoas...</p>}

      {!loading && (
        <PessoaTable pessoas={pessoas} onDeleted={fetchPessoas} onError={handleError} />
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

export default PessoasPage;


