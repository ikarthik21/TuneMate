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

export const generateVerificationMail = (verificationLink) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Jaro:opsz@6..72&family=Montserrat:ital,wght@0,500;1,500&display=swap" rel="stylesheet">
      <style>
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    </head>
    <body style="background-color: #1a1a1a; margin: 0; padding: 0; font-family: 'Poppins', 'Roboto', sans-serif; text-align: center;">
      <table role="presentation" style="width: 100%; background-color: #1a1a1a; padding: 30px 0; text-align: center;">
        <tr>
          <td>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 30px 50px; border-radius: 20px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); max-width: 600px; margin: 0 auto; animation: fadeIn 1s ease-in-out;">
              
              <!-- Company Logo -->
              <div style="text-align: center; font-family: 'Black Han Sans', sans-serif; font-weight: 600;  ">
              <h1 style=" font-size: 2.2rem; color: #f1f1f1;">
                Welcome to <span style="color: #59c2ef; font-size: 2.5rem; text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);">TuneMate</span>
              </h1>
            </div>
              
              <!-- Header -->
              <div style="font-size: 1.5rem; margin-bottom: 15px; color:  #59c2ef; font-weight: 600; font-family: 'Poppins', sans-serif; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">
                Verify Your Email
              </div>
              
              <!-- Content -->
              <div style="font-size: 0.8rem; line-height: 1.6; margin-bottom: 20px; color: #f1f1f1; font-family: 'Roboto', sans-serif;">
                <p style="margin: 0;">Thank you for signing up! Please verify your email by clicking the button below:</p>
                <a href="${verificationLink}" style="background-color:  #59c2ef; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; font-size: 14px; display: inline-block; margin-top: 15px; transition: background-color 0.3s ease;">Verify Email</a>
                <p style="margin: 10px 0 0;">If you did not sign up, please ignore this email.</p>
              </div>

              <!-- Footer -->
              <div style="margin-top: 20px; font-size: 12px; color: #888888;">
                <p>If you have any questions, feel free to contact us.</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
};
