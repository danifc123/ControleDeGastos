
using Models.Entities;
using Repository;

namespace Service.PessoaService
{
    public class PessoaService
    {
            private readonly PessoaRepository _pessoaRepository;

            public PessoaService(PessoaRepository pessoaRepository)
            {
                _pessoaRepository = pessoaRepository;
            }

            public async Task<List<Pessoa>> GetAllPessoas()
            {
                return await _pessoaRepository.GetAllPessoasAsync();
            }

            public async Task<Pessoa> CreatePessoa(Pessoa pessoa)
            {
                return await _pessoaRepository.CreateAsync(pessoa);
            }

            public async Task<bool> DeletePessoa(int id)
            {
                return await _pessoaRepository.DeleteAsync(id);
            }

            public async Task<List<PessoaComTotais>> GetPessoasComTotais()
            {
                return await _pessoaRepository.GetPessoasComTotaisAsync();
            }

            public async Task<TotalGeral> GetTotalGeral()
            {
                return await _pessoaRepository.GetTotalGeralAsync();
            }
        }
    }
