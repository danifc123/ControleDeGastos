import { useCallback, useEffect, useMemo, useState } from "react";
import type { Categoria, Pessoa, TipoTransacao, Transacao } from "../../types";
import { apiGet, apiPost } from "../../services/api";
import "./TransacaoForm.css";

type Props = {
  onCreated: () => Promise<void>;
  onError: (message: string) => void;
};

type TipoOption = { label: string; value: TipoTransacao };

const tipoOptions: TipoOption[] = [
  { label: "Receita", value: 1 },
  { label: "Despesa", value: 2 },
];

function normalizeFinalidade(value: string): "Receita" | "Despesa" | "Ambas" | "Outra" {
  const v = value.trim().toLowerCase();
  if (v === "receita") return "Receita";
  if (v === "despesa") return "Despesa";
  if (v === "ambas") return "Ambas";
  return "Outra";
}

function TransacaoForm({ onCreated, onError }: Props) {
  const [descricao, setDescricao] = useState("");
  const [valorTexto, setValorTexto] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>(2);
  const [pessoaId, setPessoaId] = useState<number | "">("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [creating, setCreating] = useState(false);

  // Estados para busca de pessoa
  const [pessoaSearch, setPessoaSearch] = useState("");
  const [showPessoaDropdown, setShowPessoaDropdown] = useState(false);

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId),
    [pessoas, pessoaId]
  );

  // Filtra pessoas pelo texto de busca
  const pessoasFiltradas = useMemo(() => {
    if (!pessoaSearch.trim()) return pessoas;
    const searchLower = pessoaSearch.toLowerCase();
    return pessoas.filter((p) => p.nome.toLowerCase().includes(searchLower));
  }, [pessoas, pessoaSearch]);

  const categoriasFiltradas = useMemo(() => {
    // Regra: se tipo é Despesa, não pode categoria Finalidade=Receita.
    // Se tipo é Receita, não pode categoria Finalidade=Despesa.
    // Se Finalidade=Ambas, sempre pode.
    return categorias.filter((c) => {
      const f = normalizeFinalidade(c.finalidade);
      if (f === "Ambas") return true;
      if (tipo === 2 && f === "Receita") return false;
      if (tipo === 1 && f === "Despesa") return false;
      // Para valores inesperados, deixamos aparecer (backend vai validar).
      return true;
    });
  }, [categorias, tipo]);

  const handleError = useCallback(
    (message: string) => {
      onError(message);
    },
    [onError]
  );

  // Se trocar o tipo, e a categoria selecionada não for mais válida, limpamos.
  useEffect(() => {
    if (categoriaId === "") return;
    const stillValid = categoriasFiltradas.some((c) => c.id === categoriaId);
    if (!stillValid) setCategoriaId("");
  }, [categoriasFiltradas, categoriaId]);

  // Fecha dropdown de pessoa ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-pessoa-search]')) {
        setShowPessoaDropdown(false);
      }
    }
    if (showPessoaDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showPessoaDropdown]);

  useEffect(() => {
    async function loadRefs() {
      try {
        setLoadingRefs(true);
        handleError("");
        const [pessoasData, categoriasData] = await Promise.all([
          apiGet<Pessoa[]>("/api/pessoa"),
          apiGet<Categoria[]>("/api/categoria"),
        ]);
        setPessoas(pessoasData);
        setCategorias(categoriasData);
      } catch (err) {
        console.error(err);
        handleError(err instanceof Error ? err.message : "Erro ao carregar pessoas/categorias");
      } finally {
        setLoadingRefs(false);
      }
    }

    loadRefs();
  }, [handleError]);

  // Converte texto de valor para número (aceita vírgula ou ponto como separador decimal)
  function parseValor(texto: string): number | null {
    const limpo = texto.trim().replace(",", ".");
    const num = parseFloat(limpo);
    if (isNaN(num) || num <= 0) return null;
    return num;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const descricaoTrim = descricao.trim();

    if (!descricaoTrim) return onError("Descrição é obrigatória.");

    const valor = parseValor(valorTexto);
    if (valor === null) return onError("Valor deve ser um número maior que zero.");

    if (pessoaId === "") return onError("Selecione uma pessoa.");
    if (categoriaId === "") return onError("Selecione uma categoria.");

    if (pessoaSelecionada && pessoaSelecionada.idade < 18 && tipo === 1) {
      return handleError("Menores de idade podem criar apenas despesas.");
    }

    try {
      setCreating(true);
      handleError("");

      await apiPost<Transacao, { descricao: string; valor: number; tipo: TipoTransacao; pessoaId: number; categoriaId: number }>(
        "/api/transacao",
        {
          descricao: descricaoTrim,
          valor,
          tipo,
          pessoaId: pessoaId as number,
          categoriaId: categoriaId as number,
        }
      );

      setDescricao("");
      setValorTexto("");
      setTipo(2);
      setPessoaId("");
      setPessoaSearch("");
      setCategoriaId("");
      setShowPessoaDropdown(false);
      await onCreated();
    } catch (err) {
      console.error(err);
      handleError(err instanceof Error ? err.message : "Erro ao criar transação");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="card">
      <h2 className="cardTitle">Cadastrar transação</h2>

      {loadingRefs ? (
        <p>Carregando pessoas e categorias...</p>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">Descrição</span>
            <input
              className="input"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Mercado"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span className="label">Valor</span>
            <input
              className="input"
              type="text"
              value={valorTexto}
              onChange={(e) => {
                const v = e.target.value;
                // Permite apenas números, vírgula e ponto
                if (v === "" || /^[0-9]+([,.]?[0-9]*)?$/.test(v)) {
                  setValorTexto(v);
                }
              }}
              placeholder="Ex: 150,50 ou 150.50"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span className="label">Tipo</span>
            <select className="input" value={tipo} onChange={(e) => setTipo(Number(e.target.value) as TipoTransacao)}>
              {tipoOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <div className="field">
            <span className="label">Pessoa</span>
            <div className="pessoaSearchWrapper" data-pessoa-search>
              <input
                className="input"
                type="text"
                value={pessoaSelecionada ? `${pessoaSelecionada.nome} (${pessoaSelecionada.idade} anos)` : pessoaSearch}
                onChange={(e) => {
                  setPessoaSearch(e.target.value);
                  setShowPessoaDropdown(true);
                  if (!e.target.value) {
                    setPessoaId("");
                  }
                }}
                onFocus={() => {
                  if (!pessoaSelecionada) setShowPessoaDropdown(true);
                }}
                placeholder="Digite o nome da pessoa..."
                autoComplete="off"
              />
              {showPessoaDropdown && pessoaSearch && pessoasFiltradas.length > 0 && (
                <div className="pessoaDropdown">
                  {pessoasFiltradas.map((p) => (
                    <div
                      key={p.id}
                      className="pessoaDropdownItem"
                      onClick={() => {
                        setPessoaId(p.id);
                        setPessoaSearch("");
                        setShowPessoaDropdown(false);
                      }}
                    >
                      {p.nome} ({p.idade} anos)
                    </div>
                  ))}
                </div>
              )}
            </div>
            {pessoaSelecionada && (
              <button
                type="button"
                className="clearSelectionButton"
                onClick={() => {
                  setPessoaId("");
                  setPessoaSearch("");
                  setShowPessoaDropdown(false);
                }}
              >
                Limpar seleção
              </button>
            )}
          </div>

          <label className="field">
            <span className="label">Categoria</span>
            <select
              className="input"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Selecione...</option>
              {categoriasFiltradas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descricao} ({c.finalidade})
                </option>
              ))}
            </select>
          </label>

          <button className="button" type="submit" disabled={creating}>
            {creating ? "Salvando..." : "Criar transação"}
          </button>
        </form>
      )}
    </section>
  );
}

export default TransacaoForm;


