import { useMemo } from "react";
import type { Transacao, TipoTransacao } from "../../types";

type Props = {
  transacoes: Transacao[];
};

function tipoToLabel(tipo: TipoTransacao): string {
  return tipo === 1 ? "Receita" : "Despesa";
}

function formatMoney(value: number): string {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  } catch {
    return String(value);
  }
}

function TransacaoTable({ transacoes }: Props) {
  const sorted = useMemo(() => {
    return [...transacoes].sort((a, b) => b.id - a.id);
  }, [transacoes]);

  if (sorted.length === 0) {
    return <p>Nenhuma transação cadastrada.</p>;
  }

  return (
    <section className="card">
      <h2 className="cardTitle">Transações cadastradas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th className="right">Valor</th>
            <th>Pessoa</th>
            <th>Categoria</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.descricao}</td>
              <td>{tipoToLabel(t.tipo)}</td>
              <td className="right">{formatMoney(t.valor)}</td>
              <td>{t.pessoa?.nome ?? `#${t.pessoaId}`}</td>
              <td>{t.categoria?.descricao ?? `#${t.categoriaId}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default TransacaoTable;


