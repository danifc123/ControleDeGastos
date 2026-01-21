using EFModels;
using Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Repository.TransacaoRepository
{
  public class TransacaoRepository
  {
    private readonly ControleDeGastos _context;

    public TransacaoRepository(ControleDeGastos context)
    {
      _context = context;
    }

    public async Task<Transacao> CreateTransacaoAsync(Transacao transacao)
    {
      _context.Transacoes.Add(transacao);
      await _context.SaveChangesAsync();
      return transacao;
    }

    public async Task<List<Transacao>> GetAllTransacoesAsync()
    {
      return await _context.Transacoes
          .Include(t => t.Pessoa)
          .Include(t => t.Categoria)
          .ToListAsync();
    }
  }
}

