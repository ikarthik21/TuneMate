import { getPrismaInstance } from "../../utils/prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailHelper } from "./EmailHelper.js";
import path from "path";
import { fileURLToPath } from "url";

export const UserController = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const __messagePath = path.join(__dirname, "../../public/messages");

  return {
    async verifyToken(req, res) {
      try {
        const { token } = req.query;
        const prisma = await getPrismaInstance();
        // Find the user with the provided token
        const user = await prisma.user.findFirst({
          where: {
            verificationToken: token,
            verificationTokenExpiry: {
              gte: new Date()
            }
          }
        });

        if (!user) {
          res.sendFile("token_expiry.html", { root: __messagePath });
        }
        // Update the user's verified status
        await prisma.user.update({
          where: { id: user.id },
          data: {
            verified: true,
            verificationToken: null,
            verificationTokenExpiry: null
          }
        });
        res.sendFile("token_success.html", { root: __messagePath });
      } catch (error) {
        console.error("Error in verifyToken:", error.message);
        res.sendFile("token_failure.html", { root: __messagePath });
      }
    },
    async register(req, res) {
      const { email, username, password } = req.body;

      try {
        const prisma = await getPrismaInstance();

        // Check for existing user by email or username
        const existingUser = await prisma.User.findFirst({
          where: {
            OR: [{ email }, { username }]
          }
        });

        if (existingUser) {
          const message =
            existingUser.email === email
              ? "User with this email already exists"
              : "User with this username already exists";
          return res.status(200).json({
            data: { message, type: "error" }
          });
        }

        // Hash password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.User.create({
          data: {
            email,
            username,
            password: hashedPassword,
            playerState: {
              songId: "",
              playListId: "",
              currentSongIndex: -1,
              Volume: 50,
              playListType: ""
            }
          }
        });

        // Send verification email
        const mailSent = await EmailHelper().sendVerificationMail(email, user);

        if (!mailSent) {
          return res.status(500).json({
            data: {
              message: "Error sending verification email.",
              type: "error"
            }
          });
        }

        return res.status(201).json({
          data: {
            message: "User created successfully. Please verify your email.",
            type: "success"
          }
        });
      } catch (error) {
        console.error("Error in register:", error.message);

        return res.status(500).json({
          data: {
            message: "Error creating user. Please try again later.",
            type: "error"
          }
        });
      }
    },

    async login(req, res) {
      const { email, password } = req.body;
      const prisma = await getPrismaInstance();
      const user = await prisma.User.findUnique({ where: { email } });

      if (!user) {
        return res.status(200).json({
          data: { message: "User not found", type: "error" }
        });
      }

      if (user.verified !== true) {
        return res.status(200).json({
          data: {
            message: "Please verify your mail and Try Again",
            type: "error"
          }
        });
      }

      try {
        const userid = user.id;
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
          return res.status(200).json({
            data: { message: "Wrong Username or Password", type: "error" }
          });
        }
        const accessToken = jwt.sign(
          {
            userid: userid,
            username: user.username,
            role: user.role
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" } // Adding expiration (e.g., 1 hour)
        );
        return res.status(200).json({
          data: {
            accessToken,
            message: "Login successful",
            type: "success"
          }
        });
      } catch (err) {
        console.log(err);
        return res.status(200).json({
          data: { message: "Internal Server Error" }
        });
      }
    }
  };
};
