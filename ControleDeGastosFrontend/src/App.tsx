import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import PessoasPage from "./pages/Pessoas/Pessoas";
import CategoriasPage from "./pages/Categorias/Categorias";
import TransacoesPage from "./pages/Transacoes/Transacoes";
import TotaisPage from "./pages/Totais/Totais";
import HomePage from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <header className="topbar">
          <div className="brand">Controle de Gastos</div>
          <nav className="nav">
            <Link to="/">Início</Link>
            <Link to="/pessoas">Pessoas</Link>
            <Link to="/categorias">Categorias</Link>
            <Link to="/transacoes">Transações</Link>
            <Link to="/totais">Totais</Link>
          </nav>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pessoas" element={<PessoasPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/transacoes" element={<TransacoesPage />} />
            <Route path="/totais" element={<TotaisPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
