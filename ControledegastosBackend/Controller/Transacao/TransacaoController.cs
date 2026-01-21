using Microsoft.AspNetCore.Mvc;
using Models.Entities;
using Service.TransacaoService;

namespace Controller.TransacaoController
{
  [ApiController]
  [Route("api/[controller]")]
  public class TransacaoController : ControllerBase
  {
    private readonly TransacaoService _transacaoService;

    public TransacaoController(TransacaoService transacaoService)
    {
      _transacaoService = transacaoService;
    }

    // GET /api/transacao
    [HttpGet]
    public async Task<ActionResult<List<Transacao>>> GetAll()
    {
      var transacoes = await _transacaoService.GetAllTransacoes();
      return Ok(transacoes);
    }

    // POST /api/transacao
    [HttpPost]
    public async Task<ActionResult<Transacao>> Create([FromBody] Transacao transacao)
    {
      try
      {
        var transacaoCriada = await _transacaoService.CreateTransacao(transacao);
        return CreatedAtAction(nameof(GetAll), new { id = transacaoCriada.Id }, transacaoCriada);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }



    //Para documentaçãp anotar as rotas HTTP:
    //GET /api/transacao - Lista todas as transações
    //POST /api/transacao - Criar nova transação

  }
}


