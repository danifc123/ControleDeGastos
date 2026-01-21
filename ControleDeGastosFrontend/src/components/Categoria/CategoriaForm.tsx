import { useState } from "react";
import type { Categoria } from "../../types";
import { apiPost } from "../../services/api";


type Props = {
  onCreated: () => Promise<void>;
  onError: (message: string) => void;
};

function CategoriaForm({ onCreated, onError }: Props) {
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<string>("Ambas");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const descricaoTrim = descricao.trim();

    if (!descricaoTrim) {
      onError("Descrição é obrigatória.");
      return;
    }

    const finalidadesValidas = ["Receita", "Despesa", "Ambas"];
    if (!finalidadesValidas.includes(finalidade)) {
      onError("Finalidade inválida. Use Receita, Despesa ou Ambas.");
      return;
    }

    try {
      setCreating(true);
      onError("");
      await apiPost<Categoria, { descricao: string; finalidade: string }>("/api/categoria", {
        descricao: descricaoTrim,
        finalidade,
      });
      setDescricao("");
      setFinalidade("Ambas");
      await onCreated();
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err.message : "Erro ao criar categoria");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="card">
      <h2 className="cardTitle">Cadastrar categoria</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Descrição</span>
          <input
            className="input"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Alimentação"
            autoComplete="off"
          />
        </label>

        <label className="field">
          <span className="label">Finalidade</span>
          <select className="input" value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
            <option value="Ambas">Ambas</option>
          </select>
        </label>

        <button className="button" type="submit" disabled={creating}>
          {creating ? "Salvando..." : "Criar categoria"}
        </button>
      </form>
    </section>
  );
}

export default CategoriaForm;

