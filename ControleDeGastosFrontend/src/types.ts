// Tipos alinhados com as entidades do backend (.NET)

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export type TipoTransacao = 1 | 2; // 1 = Receita, 2 = Despesa (mesmo que o enum do backend)

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: string; // "Receita" | "Despesa" | "Ambas"
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
  categoriaId: number;
  pessoa: Pessoa;
  categoria: Categoria;
}

export interface PessoaComTotais {
  id: number;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface CategoriaComTotais {
  id: number;
  descricao: string;
  finalidade: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalGeral {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}


