using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CMS.data.Migrations
{
    /// <inheritdoc />
    public partial class AddOtpToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOtpVerified",
                table: "Customers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OtpCode",
                table: "Customers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OtpExpireTime",
                table: "Customers",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOtpVerified",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "OtpCode",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "OtpExpireTime",
                table: "Customers");
        }
    }
}
