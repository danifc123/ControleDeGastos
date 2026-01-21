using System;
using Models.Entities;
using Models.Enums;
using Repository.TransacaoRepository;
using EFModels;
using Microsoft.EntityFrameworkCore;

namespace Service.TransacaoService
{
  public class TransacaoService
  {
    private readonly TransacaoRepository _transacaoRepository;
    private readonly ControleDeGastos _context;

    public TransacaoService(TransacaoRepository transacaoRepository, ControleDeGastos context)
    {
      _transacaoRepository = transacaoRepository;
      _context = context;
    }

    public async Task<List<Transacao>> GetAllTransacoes()
    {
      return await _transacaoRepository.GetAllTransacoesAsync();
    }

    public async Task<Transacao> CreateTransacao(Transacao transacao)
    {
      if (transacao.Valor <= 0)
      {
        throw new ArgumentException("O valor da transação deve ser maior que zero.");
      }

      var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
      if (pessoa == null)
      {
        throw new ArgumentException("Pessoa não encontrada.");
      }

      if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
      {
        throw new ArgumentException("Menores de idade podem criar apenas despesas.");
      }

      var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);
      if (categoria == null)
      {
        throw new ArgumentException("Categoria não encontrada.");
      }

      if (transacao.Tipo == TipoTransacao.Despesa && categoria.Finalidade.Equals("Receita", StringComparison.OrdinalIgnoreCase))
      {
        throw new ArgumentException("Não é possível usar uma categoria de Receita para uma transação do tipo Despesa.");
      }

      if (transacao.Tipo == TipoTransacao.Receita && categoria.Finalidade.Equals("Despesa", StringComparison.OrdinalIgnoreCase))
      {
        throw new ArgumentException("Não é possível usar uma categoria de Despesa para uma transação do tipo Receita.");
      }

      return await _transacaoRepository.CreateTransacaoAsync(transacao);
    }
  }
}

