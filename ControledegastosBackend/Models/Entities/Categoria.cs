using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
  public class Categoria
  {
    #region Id
    [Key]
    public int Id { get; set; }
    #endregion
    #region Propriedades
    [Required]
    public required string Descricao { get; set; }
    [Required]
    public required string Finalidade { get; set; }
    // Navegação para as transações da categoria; não precisa ser enviada pelo frontend
    [JsonIgnore]
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    #endregion
  }
}
