using EFModels;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using Models.Enums;
namespace Repository
{
  public class PessoaRepository
  {
    private readonly ControleDeGastos _context;
    public PessoaRepository(ControleDeGastos context)
    {
      _context = context;
    }

    public async Task<Pessoa> CreateAsync(Pessoa pessoa)
    {
      _context.Pessoas.Add(pessoa);
      await _context.SaveChangesAsync();
      return pessoa;
    }
    public async Task<bool> DeleteAsync(int id)
    {
      var pessoa = await _context.Pessoas.FindAsync(id);
      if (pessoa == null)
        return false;

      _context.Pessoas.Remove(pessoa);
      await _context.SaveChangesAsync();
      return true;
    }
    public async Task<List<Pessoa>> GetAllPessoasAsync()
    {
      return await _context.Pessoas.ToListAsync();
    }
    public async Task<List<PessoaComTotais>> GetPessoasComTotaisAsync()
    {
      var pessoas = await _context.Pessoas
          .Include(p => p.Transacoes)
          .ToListAsync();

      var resultado = pessoas.Select(p => new PessoaComTotais
      {
        Id = p.Id,
        Nome = p.Nome,
        Idade = p.Idade,
        TotalReceitas = p.Transacoes
              .Where(t => t.Tipo == TipoTransacao.Receita)
              .Sum(t => t.Valor),
        TotalDespesas = p.Transacoes
              .Where(t => t.Tipo == TipoTransacao.Despesa)
              .Sum(t => t.Valor)
      }).ToList();

      foreach (var item in resultado)
      {
        item.Saldo = item.TotalReceitas - item.TotalDespesas;
      }

      return resultado;
    }
    public async Task<TotalGeral> GetTotalGeralAsync()
    {
      var todasTransacoes = await _context.Transacoes.ToListAsync();

      var totalReceitas = todasTransacoes
          .Where(t => t.Tipo == TipoTransacao.Receita)
          .Sum(t => t.Valor);

      var totalDespesas = todasTransacoes
          .Where(t => t.Tipo == TipoTransacao.Despesa)
          .Sum(t => t.Valor);

      return new TotalGeral
      {
        TotalReceitas = totalReceitas,
        TotalDespesas = totalDespesas,
        SaldoLiquido = totalReceitas - totalDespesas
      };
    }
  }
}
