import { useState } from "react";
import type { Pessoa } from "../../types";
import { apiPost } from "../../services/api";


type Props = {
  onCreated: () => Promise<void>;
  onError: (message: string) => void;
};

function PessoaForm({ onCreated, onError }: Props) {
  const [nome, setNome] = useState("");
  const [idadeTexto, setIdadeTexto] = useState("18");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nomeTrim = nome.trim();

    if (!nomeTrim) {
      onError("Nome é obrigatório.");
      return;
    }

    const idade = parseInt(idadeTexto.trim(), 10);
    if (isNaN(idade) || !Number.isInteger(idade) || idade <= 0) {
      onError("Idade deve ser um número inteiro positivo.");
      return;
    }

    try {
      setCreating(true);
      onError("");
      await apiPost<Pessoa, { nome: string; idade: number }>("/api/pessoa", { nome: nomeTrim, idade });
      setNome("");
      setIdadeTexto("18");
      await onCreated();
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err.message : "Erro ao criar pessoa");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="card">
      <h2 className="cardTitle">Cadastrar pessoa</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Nome</span>
          <input
            className="input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Ana"
            autoComplete="off"
          />
        </label>

        <label className="field">
          <span className="label">Idade</span>
          <input
            className="input"
            type="text"
            value={idadeTexto}
            onChange={(e) => {
              const v = e.target.value;
              // Permite apenas números inteiros
              if (v === "" || /^\d+$/.test(v)) {
                setIdadeTexto(v);
              }
            }}
            placeholder="Ex: 25"
            autoComplete="off"
          />
        </label>

        <button className="button" type="submit" disabled={creating}>
          {creating ? "Salvando..." : "Criar pessoa"}
        </button>
      </form>
    </section>
  );
}

export default PessoaForm;


