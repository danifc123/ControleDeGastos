import { Link } from "react-router-dom";
import "./Home.css";

function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">Bem-vindo</p>
        <h1>Teste prático do Daniel</h1>
        <p className="subtitle">
          Escolha uma das seções abaixo para gerenciar Pessoas, Categorias, Transações
          e consultar Totais. Interface simples e focada nas regras do desafio.
        </p>
      </section>

      <section className="tiles">
        <Link className="tile" to="/pessoas">
          <div className="tileTitle">Pessoas</div>
          <div className="tileDesc">Criar, listar e deletar pessoas</div>
        </Link>

        <Link className="tile" to="/categorias">
          <div className="tileTitle">Categorias</div>
          <div className="tileDesc">Criar, listar e deletar categorias</div>
        </Link>

        <Link className="tile" to="/transacoes">
          <div className="tileTitle">Transações</div>
          <div className="tileDesc">Criar e listar transações</div>
        </Link>

        <Link className="tile" to="/totais">
          <div className="tileTitle">Totais</div>
          <div className="tileDesc">Totais por pessoa e categoria</div>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;


