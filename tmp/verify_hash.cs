using BCrypt.Net;
using System;

class Program {
    static void Main() {
        string password = "Admin@2026";
        string hash = BCrypt.Net.BCrypt.HashPassword(password);
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Hash: {hash}");
        
        bool matches = BCrypt.Net.BCrypt.Verify(password, hash);
        Console.WriteLine($"Matches: {matches}");
        
        // Check the user's hash
        string providedHash = "$2a$11$K8BmOhV5Ye4wQk9N3LpXOeHUJ8zVVVGfqmYdVs5LbN7RqyRH5K5Hy";
        bool providedMatches = BCrypt.Net.BCrypt.Verify(password, providedHash);
        Console.WriteLine($"Provided Hash Matches: {providedMatches}");
    }
}
