import { useEffect, useMemo, useState } from "react";
import type { PessoaComTotais, CategoriaComTotais, TotalGeral } from "../../types";
import { apiGet } from "../../services/api";
import "./Totais.css";

function formatMoney(value: number): string {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  } catch {
    return String(value);
  }
}

function TotaisPage() {
  const [pessoasComTotais, setPessoasComTotais] = useState<PessoaComTotais[]>([]);
  const [totalGeralPessoas, setTotalGeralPessoas] = useState<TotalGeral | null>(null);
  const [categoriasComTotais, setCategoriasComTotais] = useState<CategoriaComTotais[]>([]);
  const [totalGeralCategorias, setTotalGeralCategorias] = useState<TotalGeral | null>(null);

  const [loadingPessoas, setLoadingPessoas] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiBaseUrl = useMemo(() => import.meta.env.VITE_API_BASE_URL as string, []);

  async function fetchTotaisPessoas() {
    try {
      setLoadingPessoas(true);
      setError(null);
      const [pessoasData, totalGeralData] = await Promise.all([
        apiGet<PessoaComTotais[]>("/api/pessoa/totais"),
        apiGet<TotalGeral>("/api/pessoa/totais/geral"),
      ]);
      setPessoasComTotais(pessoasData);
      setTotalGeralPessoas(totalGeralData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erro ao carregar totais por pessoa");
    } finally {
      setLoadingPessoas(false);
    }
  }

  async function fetchTotaisCategorias() {
    try {
      setLoadingCategorias(true);
      setError(null);
      const [categoriasData, totalGeralData] = await Promise.all([
        apiGet<CategoriaComTotais[]>("/api/categoria/totais"),
        apiGet<TotalGeral>("/api/categoria/totais/geral"),
      ]);
      setCategoriasComTotais(categoriasData);
      setTotalGeralCategorias(totalGeralData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erro ao carregar totais por categoria");
    } finally {
      setLoadingCategorias(false);
    }
  }

  useEffect(() => {
    fetchTotaisPessoas();
    fetchTotaisCategorias();
  }, []);

  return (
    <div className="totaisPage">
      <header className="sectionHeader">
        <div>
          <p className="eyebrow">Totais</p>
          <h1>Consulta de totais por pessoa e categoria</h1>
          <p className="subtitle">
            API base: <strong>{apiBaseUrl}</strong>
          </p>
        </div>
      </header>

      {error && <p className="error">Erro: {error}</p>}

      {/* Seção: Totais por Pessoa */}
      <section className="card">
        <h2 className="cardTitle">Totais por Pessoa</h2>
        {loadingPessoas ? (
          <p>Carregando totais por pessoa...</p>
        ) : (
          <>
            {pessoasComTotais.length === 0 ? (
              <p>Nenhuma pessoa com transações cadastrada.</p>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Idade</th>
                      <th className="right">Total Receitas</th>
                      <th className="right">Total Despesas</th>
                      <th className="right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pessoasComTotais.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.nome}</td>
                        <td>{p.idade}</td>
                        <td className="right">{formatMoney(p.totalReceitas)}</td>
                        <td className="right">{formatMoney(p.totalDespesas)}</td>
                        <td className={`right ${p.saldo >= 0 ? "positive" : "negative"}`}>
                          {formatMoney(p.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalGeralPessoas && (
                  <div className="totalGeral">
                    <h3>Total Geral</h3>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="right"><strong>Total Receitas:</strong></td>
                          <td className="right"><strong>{formatMoney(totalGeralPessoas.totalReceitas)}</strong></td>
                        </tr>
                        <tr>
                          <td className="right"><strong>Total Despesas:</strong></td>
                          <td className="right"><strong>{formatMoney(totalGeralPessoas.totalDespesas)}</strong></td>
                        </tr>
                        <tr>
                          <td className="right"><strong>Saldo Líquido:</strong></td>
                          <td className={`right ${totalGeralPessoas.saldoLiquido >= 0 ? "positive" : "negative"}`}>
                            <strong>{formatMoney(totalGeralPessoas.saldoLiquido)}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      {/* Seção: Totais por Categoria (Opcional) */}
      <section className="card">
        <h2 className="cardTitle">Totais por Categoria</h2>
        {loadingCategorias ? (
          <p>Carregando totais por categoria...</p>
        ) : (
          <>
            {categoriasComTotais.length === 0 ? (
              <p>Nenhuma categoria com transações cadastrada.</p>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descrição</th>
                      <th>Finalidade</th>
                      <th className="right">Total Receitas</th>
                      <th className="right">Total Despesas</th>
                      <th className="right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriasComTotais.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.descricao}</td>
                        <td>{c.finalidade}</td>
                        <td className="right">{formatMoney(c.totalReceitas)}</td>
                        <td className="right">{formatMoney(c.totalDespesas)}</td>
                        <td className={`right ${c.saldo >= 0 ? "positive" : "negative"}`}>
                          {formatMoney(c.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalGeralCategorias && (
                  <div className="totalGeral">
                    <h3>Total Geral</h3>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="right"><strong>Total Receitas:</strong></td>
                          <td className="right"><strong>{formatMoney(totalGeralCategorias.totalReceitas)}</strong></td>
                        </tr>
                        <tr>
                          <td className="right"><strong>Total Despesas:</strong></td>
                          <td className="right"><strong>{formatMoney(totalGeralCategorias.totalDespesas)}</strong></td>
                        </tr>
                        <tr>
                          <td className="right"><strong>Saldo Líquido:</strong></td>
                          <td className={`right ${totalGeralCategorias.saldoLiquido >= 0 ? "positive" : "negative"}`}>
                            <strong>{formatMoney(totalGeralCategorias.saldoLiquido)}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default TotaisPage;

