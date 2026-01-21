import type { Categoria } from "../../types";
import { apiDelete } from "../../services/api";
import { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

type Props = {
  categorias: Categoria[];
  onDeleted: () => Promise<void>;
  onError: (message: string) => void;
};

function CategoriaTable({ categorias, onDeleted, onError }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  async function handleDeleteCategoria(id: number) {
    setConfirmDeleteId(id);
  }

  async function confirmDelete() {
    if (confirmDeleteId === null) return;

    try {
      setDeletingId(confirmDeleteId);
      onError("");
      await apiDelete(`/api/categoria/${confirmDeleteId}`);
      await onDeleted();
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err.message : "Erro ao deletar categoria");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  if (categorias.length === 0) {
    return <p>Nenhuma categoria cadastrada.</p>;
  }

  const categoriaParaDeletar = categorias.find((c) => c.id === confirmDeleteId);

  return (
    <>
      <section className="card">
        <h2 className="cardTitle">Categorias cadastradas</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Finalidade</th>
              <th className="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.descricao}</td>
                <td>{categoria.finalidade}</td>
                <td className="right">
                  <button
                    className="button danger"
                    onClick={() => handleDeleteCategoria(categoria.id)}
                    disabled={deletingId === categoria.id}
                    type="button"
                  >
                    {deletingId === categoria.id ? "Deletando..." : "Deletar"}
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
          categoriaParaDeletar
            ? `Tem certeza que deseja deletar a categoria "${categoriaParaDeletar.descricao}"?`
            : "Tem certeza que deseja deletar esta categoria?"
        }
        confirmText="Deletar"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  );
}

export default CategoriaTable;

