using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleDeGastosAPI.Migrations
{
    /// <inheritdoc />
    public partial class teste : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PessoaId1",
                table: "Transacoes",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_PessoaId1",
                table: "Transacoes",
                column: "PessoaId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Pessoas_PessoaId1",
                table: "Transacoes",
                column: "PessoaId1",
                principalTable: "Pessoas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Pessoas_PessoaId1",
                table: "Transacoes");

            migrationBuilder.DropIndex(
                name: "IX_Transacoes_PessoaId1",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "PessoaId1",
                table: "Transacoes");
        }
    }
}
