using Models.Entities;
using Repository.CategoriaRepository;
using Microsoft.EntityFrameworkCore;
using EFModels;

namespace Service.CategoriaService
{
  public class CategoriaService
  {
    private readonly CategoriaRepository _categoriaRepository;
    private readonly ControleDeGastos _context;

    public CategoriaService(CategoriaRepository categoriaRepository, ControleDeGastos context)
    {
      _categoriaRepository = categoriaRepository;
      _context = context;
    }

    public async Task<List<Categoria>> GetAllCategorias()
    {
      return await _categoriaRepository.GetAllCategoriasAsync();
    }

    public async Task<Categoria> CreateCategoria(Categoria categoria)
    {
      var valoresValidos = new[] { "Receita", "Despesa", "Ambas" };
      if (!valoresValidos.Contains(categoria.Finalidade))
      {
        throw new ArgumentException("Finalidade inválida. Use Receita, Despesa ou Ambas.");
      }
      return await _categoriaRepository.CreateCategoriaAsync(categoria);
    }
    public async Task<bool> DeleteCategoria(int id)
    {
      // Verifica se existem transações usando esta categoria antes de tentar deletar
      var temTransacoes = await _context.Transacoes.AnyAsync(t => t.CategoriaId == id);
      if (temTransacoes)
      {
        throw new InvalidOperationException("Não é possível deletar esta categoria pois existem transações associadas a ela.");
      }

      return await _categoriaRepository.DeleteAsync(id);
    }

    public async Task<List<CategoriaComTotais>> GetCategoriasComTotais()
    {
      return await _categoriaRepository.GetCategoriasComTotaisAsync();
    }

    public async Task<TotalGeral> GetTotalGeralPorCategoria()
    {
      return await _categoriaRepository.GetTotalGeralPorCategoriaAsync();
    }
  }
}