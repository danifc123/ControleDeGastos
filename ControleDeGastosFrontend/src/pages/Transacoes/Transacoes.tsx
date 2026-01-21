import { useEffect, useState } from "react";
import type { Transacao } from "../../types";
import { apiGet } from "../../services/api";
import TransacaoForm from "../../components/Transacao/TransacaoForm";
import TransacaoTable from "../../components/Transacao/TransacaoTable";
import AlertModal from "../../components/AlertModal/AlertModal";
import "./Transacoes.css";

function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  async function fetchTransacoes() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Transacao[]>("/api/transacao");
      setTransacoes(data);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar transações";
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransacoes();
  }, []);

  function handleError(message: string) {
    setError(message || null);
    if (message) {
      setShowErrorModal(true);
    }
  }

  return (
    <div className="transacoesPage">
      <header className="sectionHeader">
        <div>
          <p className="eyebrow">Transações</p>
          <h1>Crie e consulte transações</h1>
        </div>
      </header>

      <TransacaoForm onCreated={fetchTransacoes} onError={handleError} />

      {loading && <p>Carregando transações...</p>}

      {!loading && <TransacaoTable transacoes={transacoes} />}

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

export default TransacoesPage;


