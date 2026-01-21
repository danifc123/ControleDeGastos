using Microsoft.EntityFrameworkCore;
using Models.Entities;

namespace EFModels

{
  public class ControleDeGastos : DbContext
  {
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      #region Transacao
      // Configuração do relacionamento Transacao -> Pessoa
      modelBuilder.Entity<Transacao>()
          .HasOne(t => t.Pessoa)
          .WithMany(p => p.Transacoes)
          .HasForeignKey(t => t.PessoaId)
          .OnDelete(DeleteBehavior.Cascade);

      // Configuração do relacionamento Transacao -> Categoria
      modelBuilder.Entity<Transacao>()
          .HasOne(t => t.Categoria)
          .WithMany(c => c.Transacoes)
          .HasForeignKey(t => t.CategoriaId)
          .OnDelete(DeleteBehavior.Restrict);

      base.OnModelCreating(modelBuilder);
      #endregion
    }
    #region Construto

    //Construtor do DbContext
    public ControleDeGastos(DbContextOptions<ControleDeGastos> options) : base(options)
    {
    }
    #endregion
    #region DbSets
    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }
    #endregion

  }

}
