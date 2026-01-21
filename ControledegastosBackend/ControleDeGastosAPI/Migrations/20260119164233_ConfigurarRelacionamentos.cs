using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleDeGastosAPI.Migrations
{
    /// <inheritdoc />
    public partial class ConfigurarRelacionamentos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoriaId",
                table: "Transacoes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PessoaId",
                table: "Transacoes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_CategoriaId",
                table: "Transacoes",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_PessoaId",
                table: "Transacoes",
                column: "PessoaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Categorias_CategoriaId",
                table: "Transacoes",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Pessoas_PessoaId",
                table: "Transacoes",
                column: "PessoaId",
                principalTable: "Pessoas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Categorias_CategoriaId",
                table: "Transacoes");

            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Pessoas_PessoaId",
                table: "Transacoes");

            migrationBuilder.DropIndex(
                name: "IX_Transacoes_CategoriaId",
                table: "Transacoes");

            migrationBuilder.DropIndex(
                name: "IX_Transacoes_PessoaId",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "PessoaId",
                table: "Transacoes");
        }
    }
}
