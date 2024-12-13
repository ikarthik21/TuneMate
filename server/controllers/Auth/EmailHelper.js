import nodemailer from "nodemailer";
import {
  generateToken,
  generateVerificationMail
} from "../../utils/serverutils.js";
import { getPrismaInstance } from "../../utils/prisma/prisma.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSKEY
  }
});

export const EmailHelper = () => {
  return {
    async sendVerificationMail(email, user) {
      try {
        if (!user) {
          return false;
        }

        // Generate a verification token
        const token = generateToken();

        const prisma = await getPrismaInstance();

        // Save the token to the database with an expiration time
        await prisma.User.update({
          where: { email },
          data: {
            verificationToken: token,
            verificationTokenExpiry: new Date(Date.now() + 3600 * 1000)
          }
        });

        // Send verification email
        const verificationLink = `${process.env.BASE_URL}/api/auth/verify?token=${token}`;

        const isMailSent = await transporter.sendMail({
          from: process.env.MAILER_USER,
          to: email,
          subject: "Email Verification for TuneMate",
          html: generateVerificationMail(verificationLink)
        });

        if (!isMailSent) {
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error in sendEmail:", error.message);
        return false;
      }
    }
  };
};
