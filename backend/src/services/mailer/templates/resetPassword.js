// export const resetPasswordTemplate = (resetUrl) => ({
//   subject: 'Password Reset Request',
//   html: `
//     <h2>Password Reset</h2>
//     <p>You requested a password reset.</p>
//     <a href="${resetUrl}">Reset Password</a>
//     <p>This link will expire in 10 minutes.</p>
//   `
// });


export const resetPasswordTemplate = (resetUrl) => ({
  subject: 'Password Reset Request',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #f8f9fa;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #ffffff;
          padding: 40px 40px 0;
          text-align: center;
          border-bottom: 1px solid #e9ecef;
        }
        .content {
          padding: 40px;
        }
        .title {
          color: #212529;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 20px;
          text-align: center;
        }
        .message {
          font-size: 16px;
          color: #495057;
          margin: 0 0 30px;
          text-align: center;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 16px;
          transition: background-color 0.3s ease;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 16px;
          margin: 30px 0;
          color: #856404;
          font-size: 14px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 30px 40px;
          text-align: center;
          font-size: 14px;
          color: #6c757d;
          border-top: 1px solid #e9ecef;
        }
        .security-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 20px;
          background-color: #007bff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0 20px;
          }
          .content, .header, .footer {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="security-icon">🔒</div>
          <h1 class="title">Password Reset Request</h1>
        </div>
        
        <div class="content">
          <p class="message">
            We received a request to reset your password. If you made this request, 
            click the button below to set a new password.
          </p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="button">Reset Your Password</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in 10 minutes for security reasons.
          </div>
          
          <p style="font-size: 14px; color: #6c757d; text-align: center; margin-top: 30px;">
            If you didn't request this password reset, please ignore this email or 
            contact our support team if you have concerns about your account security.
          </p>
        </div>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
});