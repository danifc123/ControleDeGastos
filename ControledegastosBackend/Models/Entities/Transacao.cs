using Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Entities
{
  public class Transacao
  {
    #region Id
    [Key]
    public int Id { get; set; }
    #endregion
    #region Propriedades
    [Required]
    public required string Descricao { get; set; }
    public decimal Valor { get; set; }
    [Required]
    public TipoTransacao Tipo { get; set; }
    [Required]
    public int PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
    [Required]
    public int CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }
    #endregion
  }
}
