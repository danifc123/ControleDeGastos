using Microsoft.AspNetCore.Mvc;
using Models.Entities;
using Service.CategoriaService;

namespace Controller.CategoriaController
{
  [ApiController]
  [Route("api/[controller]")]
  public class CategoriaController : ControllerBase
  {
    private readonly CategoriaService _categoriaService;

    public CategoriaController(CategoriaService categoriaService)
    {
      _categoriaService = categoriaService;
    }

    // GET /api/categoria
    [HttpGet]
    public async Task<ActionResult<List<Categoria>>> GetAll()
    {
      var categorias = await _categoriaService.GetAllCategorias();
      return Ok(categorias);
    }

    // POST /api/categoria
    [HttpPost]
    public async Task<ActionResult<Categoria>> Create([FromBody] Categoria categoria)
    {
      var categoriaCriada = await _categoriaService.CreateCategoria(categoria);
      return CreatedAtAction(nameof(GetAll), new { id = categoriaCriada.Id }, categoriaCriada);
    }

    // DELETE /api/categoria/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      try
      {
        var deletado = await _categoriaService.DeleteCategoria(id);
        if (!deletado)
          return NotFound();
        return NoContent();
      }
      catch (InvalidOperationException ex)
      {
        return BadRequest(ex.Message);
      }
    }

    // GET /api/categoria/totais
    [HttpGet("totais")]
    public async Task<ActionResult<List<CategoriaComTotais>>> GetTotais()
    {
      var categoriasComTotais = await _categoriaService.GetCategoriasComTotais();
      return Ok(categoriasComTotais);
    }

    // GET /api/categoria/totais/geral
    [HttpGet("totais/geral")]
    public async Task<ActionResult<TotalGeral>> GetTotalGeral()
    {
      var totalGeral = await _categoriaService.GetTotalGeralPorCategoria();
      return Ok(totalGeral);
    }

    //Para documentaçãp anotar as rotas HTTP:
    //GET /api/categoria - Lista todas as categorias
    //POST /api/categoria - Criar nova categoria
    //DELETE /api/categoria/{id} - Deletar categoria
    //GET /api/categoria/totais - Lista categorias com totais(receitas, despesas, saldo)
    //GET /api/categoria/totais/geral - Total geral de todas as categorias



  }
}