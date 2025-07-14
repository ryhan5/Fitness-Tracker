import { createTransporter } from './transporter.js';

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
};
