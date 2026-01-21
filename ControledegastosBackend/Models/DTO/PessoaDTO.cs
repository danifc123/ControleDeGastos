// PessoaComTotais.cs
namespace Models.Entities
{
  public class PessoaComTotais
  {
    public int Id { get; set; }
    public required string Nome { get; set; }
    public int Idade { get; set; }
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
  }
}

// TotalGeral.cs
namespace Models.Entities
{
  public class TotalGeral
  {
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal SaldoLiquido { get; set; }
  }
}

// CategoriaComTotais.cs
namespace Models.Entities
{
  public class CategoriaComTotais
  {
    public int Id { get; set; }
    public required string Descricao { get; set; }
    public required string Finalidade { get; set; }
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
  }
}