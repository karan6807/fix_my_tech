// src/lib/email.js
import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'kptestingdw@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD || 'phhxqjodfbmqbcje',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Admin OTP Email
export const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"ServicedOffice Admin" <${emailConfig.auth.user}>`,
    to: email,
    subject: 'Admin Login Verification - ServicedOffice',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1f2937, #374151); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #1f2937; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .security { background: #fef3cd; border: 1px solid #fbbf24; border-radius: 5px; padding: 15px; margin: 20px 0; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Admin Login Verification</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Someone is attempting to log into the ServicedOffice admin panel with your credentials. Please use the OTP below to complete your login:</p>
            
            <div class="otp-box">
              <p>Your login verification code is:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <div class="security">
              <p><strong>Security Alert:</strong> If this wasn't you, please contact the system administrator immediately and consider changing your password.</p>
            </div>
            
            <p>Best regards,<br>The ServicedOffice Admin Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ServicedOffice. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// Employee OTP Email
// Employee Password Reset Email
export const sendEmployeePasswordResetEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"ServicedOffice Employee Portal" <${emailConfig.auth.user}>`,
    to: email,
    subject: 'Password Reset - ServicedOffice Employee Portal',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Employee Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #dc2626; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .security { background: #fef3cd; border: 1px solid #fbbf24; border-radius: 5px; padding: 15px; margin: 20px 0; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Employee Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>You requested to reset your employee portal password. Please use the code below to reset your password:</p>
            
            <div class="otp-box">
              <p>Your password reset code is:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <div class="security">
              <p><strong>Security Note:</strong> If you didn't request this password reset, please contact your supervisor immediately.</p>
            </div>
            
            <p>Best regards,<br>The ServicedOffice Employee Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ServicedOffice. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send employee password reset email: ${error.message}`);
  }
};

// Employee Login OTP Email
export const sendEmployeeOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"ServicedOffice Employee Portal" <${emailConfig.auth.user}>`,
    to: email,
    subject: 'Employee Login Verification - ServicedOffice',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Employee Login Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #fb923c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #ea580c; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #ea580c; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .security { background: #fef3cd; border: 1px solid #fbbf24; border-radius: 5px; padding: 15px; margin: 20px 0; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👨‍🔧 Employee Login Verification</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Please use the OTP below to complete your employee portal login:</p>
            
            <div class="otp-box">
              <p>Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <div class="security">
              <p><strong>Security Note:</strong> If this wasn't you, please contact your supervisor immediately.</p>
            </div>
            
            <p>Best regards,<br>The ServicedOffice Employee Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ServicedOffice. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send employee OTP email: ${error.message}`);
  }
};

// User Verification Email
export const sendVerificationEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `"ServicedOffice" <${emailConfig.auth.user}>`,
    to: email,
    subject: 'Email Verification - ServicedOffice',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Email Verification</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for signing up! Please use the verification code below to verify your email address:</p>
            
            <div class="otp-box">
              <p>Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <p>If you didn't create an account, please ignore this email.</p>
            
            <p>Best regards,<br>The ServicedOffice Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ServicedOffice. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Password Reset Email
export const sendPasswordResetEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `"ServicedOffice" <${emailConfig.auth.user}>`,
    to: email,
    subject: 'Password Reset - ServicedOffice',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #dc2626; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .security { background: #fef3cd; border: 1px solid #fbbf24; border-radius: 5px; padding: 15px; margin: 20px 0; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>You requested to reset your password. Please use the code below to reset your password:</p>
            
            <div class="otp-box">
              <p>Your password reset code is:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <div class="security">
              <p><strong>Security Note:</strong> If you didn't request this password reset, please ignore this email or contact support.</p>
            </div>
            
            <p>Best regards,<br>The ServicedOffice Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ServicedOffice. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Generic Send Email Function
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"TechService" <${emailConfig.auth.user}>`,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};