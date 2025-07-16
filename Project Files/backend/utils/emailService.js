// backend/utils/emailService.js
const nodemailer = require('nodemailer');

// Use your email credentials or environment variables here
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password_or_app_password',
  },
});

// Send Email Function
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: '"HouseHunt" <your_email@gmail.com>',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email send failed:', error);
  }
};

module.exports = sendEmail;
