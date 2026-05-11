using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Service;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace MaxVanDam.BusinessLayer.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;

        // Load email configuration from environment variables
        _smtpServer = Environment.GetEnvironmentVariable("SMTP_SERVER") ?? "smtp.gmail.com";
        _smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? "587");
        _smtpUsername = Environment.GetEnvironmentVariable("SMTP_USERNAME") ?? "";
        _smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? "";
        _fromEmail = Environment.GetEnvironmentVariable("FROM_EMAIL") ?? "noreply@maxvandam.com";
        _fromName = Environment.GetEnvironmentVariable("FROM_NAME") ?? "MaxVanDam";
    }

    public async Task<ServiceResponse> SendWelcomeEmailAsync(string toEmail, string firstName, string lastName)
    {
        try
        {
            var subject = "Bun venit la MaxVanDam!";
            var body = $@"
                <h2>Bun venit, {firstName} {lastName}!</h2>
                <p>Contul tău a fost creat cu succes pe platforma MaxVanDam.</p>
                <p>Poți începe să explorezi funcționalitățile noastre pentru gestionarea depozitului.</p>
                <br>
                <p>Echipa MaxVanDam</p>
            ";

            return await SendEmailAsync(toEmail, subject, body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending welcome email to {Email}", toEmail);
            return new ServiceResponse { IsSuccess = false, Message = "Eroare la trimiterea email-ului de bun venit" };
        }
    }

    public async Task<ServiceResponse> SendSubscriptionConfirmationAsync(string toEmail, string firstName, string planId, decimal amount)
    {
        try
        {
            var planName = planId switch
            {
                "q1" => "Plan Lunar (3 luni)",
                "q2" => "Plan Anual",
                "q3" => "Plan Trienal",
                _ => "Plan Personalizat"
            };

            var subject = "Confirmare abonament MaxVanDam";
            var body = $@"
                <h2>Confirmare abonament</h2>
                <p>Salut {firstName},</p>
                <p>Abonamentul tău <strong>{planName}</strong> în valoare de <strong>{amount} MDL</strong> a fost activat cu succes!</p>
                <p>Vei primi în curând acces la toate funcționalitățile platformei.</p>
                <br>
                <p>Mulțumim că ai ales MaxVanDam!</p>
                <p>Echipa MaxVanDam</p>
            ";

            return await SendEmailAsync(toEmail, subject, body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending subscription confirmation to {Email}", toEmail);
            return new ServiceResponse { IsSuccess = false, Message = "Eroare la trimiterea confirmării abonamentului" };
        }
    }

    public async Task<ServiceResponse> SendAdminNotificationAsync(string subject, string message)
    {
        try
        {
            var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL") ?? "admin@maxvandam.com";
            var body = $@"
                <h2>Notificare administrativă</h2>
                <p>{message}</p>
                <br>
                <p>Sistem MaxVanDam</p>
            ";

            return await SendEmailAsync(adminEmail, subject, body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending admin notification");
            return new ServiceResponse { IsSuccess = false, Message = "Eroare la trimiterea notificării administrative" };
        }
    }

    private async Task<ServiceResponse> SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        try
        {
            if (string.IsNullOrEmpty(_smtpUsername) || string.IsNullOrEmpty(_smtpPassword))
            {
                _logger.LogWarning("SMTP credentials not configured, skipping email send");
                return new ServiceResponse { IsSuccess = true, Message = "Email service not configured (development mode)" };
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_fromName, _fromEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlBody
            };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Email sent successfully to {Email} with subject: {Subject}", toEmail, subject);
            return new ServiceResponse { IsSuccess = true, Message = "Email trimis cu succes" };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {Email}", toEmail);
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare la trimiterea email-ului: {ex.Message}" };
        }
    }
}
