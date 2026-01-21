
import { useState } from "react";
import type { Pessoa } from "../../types";
import { apiDelete } from "../../services/api";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

type Props = {
  pessoas: Pessoa[];
  onDeleted: () => Promise<void>;
  onError: (message: string) => void;
};

function PessoaTable({ pessoas, onDeleted, onError }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  async function handleDeletePessoa(id: number) {
    setConfirmDeleteId(id);
  }

  async function confirmDelete() {
    if (confirmDeleteId === null) return;

    try {
      setDeletingId(confirmDeleteId);
      onError("");
      await apiDelete(`/api/pessoa/${confirmDeleteId}`);
      await onDeleted();
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err.message : "Erro ao deletar pessoa");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  if (pessoas.length === 0) {
    return <p>Nenhuma pessoa cadastrada.</p>;
  }

  const pessoaParaDeletar = pessoas.find((p) => p.id === confirmDeleteId);

  return (
    <>
      <section className="card">
        <h2 className="cardTitle">Pessoas cadastradas</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Idade</th>
              <th className="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => (
              <tr key={pessoa.id}>
                <td>{pessoa.id}</td>
                <td>{pessoa.nome}</td>
                <td>{pessoa.idade}</td>
                <td className="right">
                  <button
                    className="button danger"
                    onClick={() => handleDeletePessoa(pessoa.id)}
                    disabled={deletingId === pessoa.id}
                    type="button"
                  >
                    {deletingId === pessoa.id ? "Deletando..." : "Deletar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        message={
          pessoaParaDeletar
            ? `Tem certeza que deseja deletar "${pessoaParaDeletar.nome}"? As transações dela também serão apagadas.`
            : "Tem certeza que deseja deletar esta pessoa? As transações dela também serão apagadas."
        }
        confirmText="Deletar"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  );
}

export default PessoaTable;


