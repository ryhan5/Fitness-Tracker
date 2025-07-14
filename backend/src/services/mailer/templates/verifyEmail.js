export const verifyEmailTemplate = (verificationUrl) => ({
  subject: 'Verify Your Email Address',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          background-color: #f8f9fa;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .header {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          text-align: center;
          padding: 40px 30px;
        }
        .header .icon {
          font-size: 42px;
          margin-bottom: 10px;
        }
        .title {
          font-size: 26px;
          margin: 0;
        }
        .subtitle {
          font-size: 15px;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .message {
          font-size: 16px;
          color: #ffffff;
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #4f46e5;
          color: #fff;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #4338ca;
        }
        .info-box, .steps {
          background-color: #f1f5f9;
          padding: 20px;
          border-left: 4px solid #4f46e5;
          margin: 24px 0;
          border-radius: 6px;
        }
        .info-box h3, .steps h3 {
          margin: 0 0 10px;
          font-size: 17px;
        }
        .info-box p, .steps ol {
          margin: 0;
          font-size: 15px;
          color: #475569;
        }
        .steps ol {
          padding-left: 20px;
        }
        .steps li {
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          font-size: 13px;
          color: #6c757d;
          padding: 20px 30px;
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        @media (max-width: 600px) {
          .content, .header, .footer {
            padding: 20px !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">✉️</div>
          <h1 class="title">Email Verification</h1>
          <p class="subtitle">Please confirm your email to activate your account</p>
        </div>

        <div class="content">
          <p class="message">
            Thanks for joining us! To complete your registration and activate your account, please verify your email by clicking the button below:
          </p>

          <div class="button-container">
            <a href="${verificationUrl}" class="button" target="_blank" rel="noopener noreferrer">Verify Email Address</a>
          </div>

          <p class="message" style="font-size: 14px;">
            If the button above doesn't work, copy and paste the following link into your browser:<br/>
            <a href="${verificationUrl}" target="_blank" style="color: #4f46e5; word-break: break-all;">${verificationUrl}</a>
          </p>

          <div class="info-box">
            <h3>Why verification is important?</h3>
            <p>Verifying your email helps us ensure your account's security and allows us to keep you updated.</p>
          </div>

          <div class="steps">
            <h3>After verification, you can:</h3>
            <ol>
              <li>Access all features</li>
              <li>Receive important notifications</li>
              <li>Secure your profile and data</li>
              <li>Connect with the community</li>
            </ol>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
});
