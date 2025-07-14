// export const welcomeTemplate = (firstName) => ({
//   subject: 'Welcome to Our App!',
//   html: `
//     <div style="font-family: Arial, sans-serif; max-width: 600px;">
//       <h2 style="color: #333;">Welcome ${firstName}!</h2>
//       <p>Thank you for joining our fitness community.</p>
//       <p>We're excited to help you achieve your goals!</p>
//       <p>Regards,<br>The Team</p>
//     </div>
//   `
// });


export const welcomeTemplate = (firstName) => ({
  subject: 'Welcome to Our Fitness Community!',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
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
          background: linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%);
          padding: 50px 40px;
          text-align: center;
          color: white;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
          opacity: 0.3;
        }
        .content {
          padding: 40px;
          position: relative;
        }
        .title {
          color: #ffffff;
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 10px;
          position: relative;
          z-index: 1;
        }
        .subtitle {
          color: #ffffff;
          font-size: 18px;
          margin: 0;
          opacity: 0.9;
          position: relative;
          z-index: 1;
        }
        .welcome-message {
          font-size: 18px;
          color: #495057;
          margin: 0 0 30px;
          text-align: center;
          font-weight: 500;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .feature-card {
          background-color: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e9ecef;
          transition: transform 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-2px);
        }
        .feature-icon {
          width: 50px;
          height: 50px;
          margin: 0 auto 15px;
          background-color: #6f42c1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
        }
        .feature-title {
          color: #333;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px;
        }
        .feature-description {
          color: #6c757d;
          font-size: 14px;
          margin: 0;
        }
        .cta-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 30px;
          margin: 30px 0;
          border-radius: 8px;
          text-align: center;
        }
        .cta-title {
          color: #333;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 15px;
        }
        .cta-description {
          color: #6c757d;
          font-size: 16px;
          margin: 0 0 25px;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background-color: #6f42c1;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          margin: 10px;
        }
        .button:hover {
          background-color: #5a2d91;
          transform: translateY(-2px);
        }
        .button.secondary {
          background-color: transparent;
          color: #6f42c1;
          border: 2px solid #6f42c1;
        }
        .button.secondary:hover {
          background-color: #6f42c1;
          color: white;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 30px 40px;
          text-align: center;
          font-size: 14px;
          color: #6c757d;
          border-top: 1px solid #e9ecef;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #6c757d;
          text-decoration: none;
          font-size: 18px;
        }
        .welcome-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0 20px;
          }
          .content, .header, .footer {
            padding: 30px 20px;
          }
          .features {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="welcome-icon">🎉</div>
          <h1 class="title">Welcome ${firstName}!</h1>
          <p class="subtitle">You're now part of our fitness community</p>
        </div>
        
        <div class="content">
          <p class="welcome-message">
            Thank you for joining our fitness community! We're thrilled to have you on board 
            and excited to help you achieve your health and wellness goals.
          </p>
          
          <div class="features">
            <div class="feature-card">
              <div class="feature-icon">🏋️</div>
              <h3 class="feature-title">Personalized Workouts</h3>
              <p class="feature-description">Custom fitness plans tailored to your goals and fitness level</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3 class="feature-title">Progress Tracking</h3>
              <p class="feature-description">Monitor your achievements and stay motivated with detailed analytics</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">👥</div>
              <h3 class="feature-title">Community Support</h3>
              <p class="feature-description">Connect with like-minded individuals on similar fitness journeys</p>
            </div>
          </div>
          
          <div class="cta-section">
            <h2 class="cta-title">Ready to Start Your Journey?</h2>
            <p class="cta-description">
              Complete your profile and get your first personalized workout plan today!
            </p>
            <a href="#" class="button">Complete Profile</a>
            <a href="#" class="button secondary">Explore Features</a>
          </div>
          
          <p style="font-size: 16px; color: #495057; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <strong>Questions or need help getting started?</strong><br>
            Our support team is here to help you every step of the way. 
            Feel free to reach out anytime!
          </p>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">📱</a>
            <a href="#">🐦</a>
            <a href="#">📘</a>
            <a href="#">📷</a>
          </div>
          <p>Stay connected with us on social media for tips, motivation, and updates!</p>
          <p style="margin-top: 20px; font-size: 12px; color: #adb5bd;">
            &copy; 2025 Your Fitness Company. All rights reserved.<br>
            You're receiving this email because you recently created an account.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
});