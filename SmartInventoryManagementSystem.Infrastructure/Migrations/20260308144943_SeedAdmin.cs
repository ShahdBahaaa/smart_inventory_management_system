using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartInventoryManagementSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "CreatedAt", "Email", "IsDeleted", "LastLogin", "Name", "PasswordHash", "Role", "Status" },
                values: new object[] { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@test.com", false, null, "Admin", "$2a$11$7YFvH0nM8bCqzYbW0kJq3uQhYl3F9n0dJk3kUe9s2xJYHq7JxYy9G", 0, 0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1);
        }
    }
}
