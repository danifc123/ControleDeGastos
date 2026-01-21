using Microsoft.AspNetCore.Mvc;
using Models.Entities;
using Service.PessoaService;
using System;
namespace Controller.PessoaController
{
  [ApiController]
  [Route("api/[controller]")]
  public class PessoaController : ControllerBase
  {
    private readonly PessoaService _pessoaService;

    public PessoaController(PessoaService pessoaService)
    {
      _pessoaService = pessoaService;
    }
    //Lista todas as pessoas
    [HttpGet]
    public async Task<ActionResult<List<Pessoa>>> GetAll()
    {
      var pessoas = await _pessoaService.GetAllPessoas();
      return Ok(pessoas);
    }
    //Lista cada pessoa e o total de transações associadas
    [HttpGet("totais")]
    public async Task<ActionResult<List<PessoaComTotais>>> GetTotais()
    {
      var pessoasComTotais = await _pessoaService.GetPessoasComTotais();
      return Ok(pessoasComTotais);
    }
    //Retorna o total geral de receitas, despesas e saldo de todos
    [HttpGet("totais/geral")]
    public async Task<ActionResult<TotalGeral>> GetTotalGeral()
    {
      var totalGeral = await _pessoaService.GetTotalGeral();
      return Ok(totalGeral);
    }
    //Cria uma nova pessoa
    [HttpPost]
    public async Task<ActionResult<Pessoa>> Create([FromBody] Pessoa pessoa)
    {
      var pessoaCriada = await _pessoaService.CreatePessoa(pessoa);
      return CreatedAtAction(nameof(GetAll), new { id = pessoaCriada.Id }, pessoaCriada);
    }
    //Deleta uma pessoa selecionada pelo id
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var deletado = await _pessoaService.DeletePessoa(id);
      if (!deletado)
        return NotFound();

      return NoContent();
    }



    //Para documentaçãp anotar as rotas HTTP:
    //GET /api/pessoa - Lista todas as pessoas
    //GET /api/pessoa/totais - Lista pessoas com totais(receitas, despesas, saldo)
    //GET /api/pessoa/totais/geral - Total geral de todas as pessoas
    //POST /api/pessoa - Criar nova pessoa
    //DELETE /api/pessoa/{id} - Deletar pessoa



  }
}