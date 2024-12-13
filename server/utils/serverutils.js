import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";

export const extractAndVerifyToken = (authHeader) => {
  if (!authHeader) {
    return false;
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return false;
  }
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return false;
  }
};

export const extractFields = (data) => {
  const item = data[0];
  return {
    id: item.id,
    name: item.name,
    duration: item.duration,
    imageUrl: item.image[1].url,
    primaryArtists: item.artists.primary.map((artist) => artist.name).join(", ")
  };
};

export function generateToken() {
  const token = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    64
  )();

  return token;
}

export const TOKEN_EXPIRY_MESSAGE = `<!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: red; }
            p { font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>Invalid or Expired Token</h1>
          <p>The token provided is invalid or has expired. Please request a new verification email.</p>
        </body>
        </html>`;

export const TOKEN_VERIFY_SUCCESS = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: green; }
          p { font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>Email Verified Successfully</h1>
        <p>Thank you for verifying your email. You can now use all features of our service.</p>
      </body>
      </html>`;

export const TOKEN_VERIFY_FAILURE = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: red; }
          p { font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>Error Verifying Email</h1>
        <p>There was an error verifying your email. Please try again later.</p>
      </body>
      </html>`;

export const generateVerificationMail = (verificationLink) => {
  return `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 20px;
              text-align: center;
            }
            .email-container {
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              margin: 20px auto;
            }
            .header {
              color: #333333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .content {
              color: #555555;
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            .button {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #888888;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">Verify Your Email</div>
            <div class="content">
              <p>Thank you for signing up! Please verify your email by clicking the button below:</p>
              <a href="${verificationLink}" class="button">Verify Email</a>
              <p>If you did not sign up, please ignore this email.</p>
            </div>
     
          </div>
        </body>
      </html>`;
};
