using EFModels;
using Models.Entities;
using Models.Enums;
using Microsoft.EntityFrameworkCore;
namespace Repository.CategoriaRepository
{
  public class CategoriaRepository
  {
    private readonly ControleDeGastos _context;

    public CategoriaRepository(ControleDeGastos context)
    {
      _context = context;
    }

    public async Task<Categoria> CreateCategoriaAsync(Categoria categoria)
    {
      _context.Categorias.Add(categoria);
      await _context.SaveChangesAsync();
      return categoria;
    }

    public async Task<List<Categoria>> GetAllCategoriasAsync()
    {
      return await _context.Categorias.ToListAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
      var categoria = await _context.Categorias.FindAsync(id);
      if (categoria == null)
        return false;

      _context.Categorias.Remove(categoria);
      await _context.SaveChangesAsync();
      return true;
    }

    public async Task<List<CategoriaComTotais>> GetCategoriasComTotaisAsync()
    {
      var categorias = await _context.Categorias
          .Include(c => c.Transacoes)
          .ToListAsync();

      var resultado = categorias.Select(c => new CategoriaComTotais
      {
        Id = c.Id,
        Descricao = c.Descricao,
        Finalidade = c.Finalidade,
        TotalReceitas = c.Transacoes
              .Where(t => t.Tipo == TipoTransacao.Receita)
              .Sum(t => t.Valor),
        TotalDespesas = c.Transacoes
              .Where(t => t.Tipo == TipoTransacao.Despesa)
              .Sum(t => t.Valor)
      }).ToList();

      foreach (var item in resultado)
      {
        item.Saldo = item.TotalReceitas - item.TotalDespesas;
      }

      return resultado;
    }

    public async Task<TotalGeral> GetTotalGeralPorCategoriaAsync()
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
