using MailKit.Net.Smtp;
using MimeKit;

namespace CMS.Backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmail(
            string to,
            string subject,
            string body)
        {
            var email = new MimeMessage();

            email.From.Add(

                MailboxAddress.Parse(

                    _config["Email:Username"]

                ));

            email.To.Add(

                MailboxAddress.Parse(to)

            );

            email.Subject = subject;

            email.Body = new TextPart("html")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(

                _config["Email:Host"],

                int.Parse(_config["Email:Port"]),

                MailKit.Security.SecureSocketOptions.StartTls

            );

            await smtp.AuthenticateAsync(

                _config["Email:Username"],

                _config["Email:Password"]

            );

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);
        }
    }
}