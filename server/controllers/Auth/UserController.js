import {getPrismaInstance} from "../../utils/prisma/prisma.js";
import bcrypt from 'bcrypt';


export const UserController = () => {
    return {
        async register(req, res) {
            const {email, username, password} = req.body;

            const prisma = await getPrismaInstance();

            try {
                const existingUserByEmail = await prisma.user.findUnique({where: {email}});

                const existingUserByUsername = await prisma.user.findUnique({where: {username}});

                if (existingUserByEmail && existingUserByUsername) {
                    return res.status(200).json({
                        data: {
                            message: "User with this email and username already exists", type: "error"
                        }
                    });
                } else if (existingUserByEmail) {
                    return res.status(200).json({
                        data: {
                            message: "User with this email already exists", type: "error"
                        }
                    });
                } else if (existingUserByUsername) {
                    return res.status(200).json({
                        data: {
                            message: "User with this username already exists", type: "error"
                        }
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                await prisma.user.create({
                    data: {
                        email: email, username: username, password: hashedPassword
                    },
                });
                return res.status(201).json({data: {message: "User created successfully", type: "success"}});
            } catch (err) {
       
                return res.status(500).json({
                    data: {
                        message: "Error creating user, please try again later", type: "error"
                    }
                });
            }
        }, async login(req, res) {
            const {email, password} = req.body;
            const prisma = getPrismaInstance();
            const user = await prisma.user.findUnique({where: {email}});

            if (user) {
                try {
                    const userid = user._id.toHexString();
                    const result = await bcrypt.compare(lpassword, user.password);
                    if (!result) {
                        return res.status(401).json({message: 'Wrong Username or Password'});
                    }
                    const token = jwt.sign({userid: userid}, process.env.TOKEN_SECRET);
                    return res.status(200).json({token, message: "Login successful"})
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({message: 'Internal Server Error'});
                }
            }
            return res.status(404).json({message: "user not found"});

        }
    }
}