const nodemailer = require('nodemailer');

/**
 * Create and return a configured nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send OTP email for signup verification
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - The 6-digit OTP
 */
const sendOTPEmail = async (email, name, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"ShopSmart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Verify Your ShopSmart Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:36px 40px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🛒 ShopSmart</h1>
                    <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">Smart Shopping, Smarter Savings</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="color:#1e293b;margin:0 0 16px;font-size:22px;">Hello, ${name}! 👋</h2>
                    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px;">
                      Welcome to ShopSmart! To complete your registration and start saving on your favourite products, please verify your email address with the OTP below.
                    </p>
                    <!-- OTP Box -->
                    <div style="background:#f8fafc;border:2px dashed #3b82f6;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
                      <p style="color:#64748b;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Your Verification Code</p>
                      <div style="font-size:42px;font-weight:800;color:#1e40af;letter-spacing:12px;font-family:'Courier New',monospace;">${otp}</div>
                      <p style="color:#94a3b8;font-size:13px;margin:12px 0 0;">⏱️ This code expires in <strong>10 minutes</strong></p>
                    </div>
                    <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 16px;">
                      If you didn't create a ShopSmart account, please ignore this email. Your account will not be activated.
                    </p>
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">
                    <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                      © 2025 ShopSmart. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✓ OTP email sent to ${email}`);
};

/**
 * Send price alert email to user
 * @param {Object} alertData - Alert details
 */
const sendPriceAlertEmail = async (alertData) => {
  const { userEmail, userName, productName, targetPrice, currentPrice, store, productLink, productImage } = alertData;
  const transporter = createTransporter();

  const savings = targetPrice - currentPrice;
  const savingsPercent = ((savings / targetPrice) * 100).toFixed(0);

  const mailOptions = {
    from: `"ShopSmart Price Alert" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🔔 Price Drop Alert! "${productName.substring(0, 40)}..." is now ₹${currentPrice}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Price Alert</title>
      </head>
      <body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#059669,#10b981);padding:36px 40px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">🎉 Price Drop Alert!</h1>
                    <p style="color:#a7f3d0;margin:8px 0 0;font-size:14px;">Your target price has been reached on ShopSmart</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="color:#1e293b;margin:0 0 8px;font-size:20px;">Hi ${userName},</h2>
                    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px;">
                      Great news! A product you're watching has dropped to or below your target price. It's time to grab it!
                    </p>
                    
                    <!-- Product Info -->
                    <div style="background:#f8fafc;border-radius:12px;padding:24px;margin:0 0 24px;border-left:4px solid #10b981;">
                      ${productImage ? `<img src="${productImage}" alt="Product" style="max-width:100px;max-height:100px;object-fit:contain;margin-bottom:12px;border-radius:8px;">` : ''}
                      <h3 style="color:#1e293b;margin:0 0 16px;font-size:16px;font-weight:600;">${productName}</h3>
                      <table width="100%" cellpadding="6" cellspacing="0">
                        <tr>
                          <td style="color:#64748b;font-size:14px;">Store:</td>
                          <td style="color:#1e293b;font-size:14px;font-weight:600;">${store}</td>
                        </tr>
                        <tr>
                          <td style="color:#64748b;font-size:14px;">Your Target Price:</td>
                          <td style="color:#64748b;font-size:14px;text-decoration:line-through;">₹${targetPrice}</td>
                        </tr>
                        <tr>
                          <td style="color:#64748b;font-size:14px;">Current Price:</td>
                          <td style="color:#059669;font-size:22px;font-weight:800;">₹${currentPrice}</td>
                        </tr>
                        <tr>
                          <td style="color:#64748b;font-size:14px;">You Save:</td>
                          <td style="color:#059669;font-size:15px;font-weight:700;">₹${savings} (${savingsPercent}% off your target!)</td>
                        </tr>
                      </table>
                    </div>

                    <!-- CTA Button -->
                    ${productLink ? `
                    <div style="text-align:center;margin:0 0 28px;">
                      <a href="${productLink}" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 36px;border-radius:10px;letter-spacing:0.3px;">
                        Buy Now on ${store} →
                      </a>
                    </div>` : ''}

                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">
                    <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center;">
                      You're receiving this because you set a price alert on ShopSmart. 
                      <br>© 2025 ShopSmart. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✓ Price alert email sent to ${userEmail} for "${productName}"`);
};

module.exports = { sendOTPEmail, sendPriceAlertEmail };
