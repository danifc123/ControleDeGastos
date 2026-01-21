using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models.Entities
{
  public class Pessoa
  {
    #region Id
    [Key]
    public int Id { get; set; }
    #endregion
    #region Propriedades
    [Required]
    public required string Nome { get; set; }
    [Range(1, 150)]
    public int Idade { get; set; }
    // Navegação para as transações da pessoa; não precisa ser enviada pelo frontend
    [JsonIgnore]
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    #endregion
  }
}
