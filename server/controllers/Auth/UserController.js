import {getPrismaInstance} from "../../utils/prisma/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const UserController = () => {
    return {
        async register(req, res) {
            const {email, username, password} = req.body;

            const prisma = await getPrismaInstance();

            try {
                const existingUserByEmail = await prisma.User.findUnique({where: {email}});

                const existingUserByUsername = await prisma.User.findUnique({where: {username}});

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
                await prisma.User.create({
                    data: {
                        email: email, username: username, password: hashedPassword, playerState: {
                            songId: "",
                            playListId: "",
                            currentSongIndex: -1,
                            Volume: 50,
                            playListType: ""
                        },
                    },
                });
                return res.status(201).json({data: {message: "User created successfully", type: "success"}});
            } catch (err) {
                console.log(err)

                return res.status(500).json({
                    data: {
                        message: "Error creating user, please try again later", type: "error"
                    }
                });
            }
        },
        async login(req, res) {
            const {email, password} = req.body;
            const prisma = await getPrismaInstance();
            const user = await prisma.User.findUnique({where: {email}});
            if (user) {
                try {
                    const userid = user.id;
                    const result = await bcrypt.compare(password, user.password);
                    if (!result) {
                        return res.status(200).json({
                            data: {message: 'Wrong Username or Password', type: "error"}
                        });
                    }
                    const accessToken = jwt.sign({
                        userid: userid,
                        username: user.username,
                        role: user.role
                    }, process.env.TOKEN_SECRET);
                    return res.status(200).json({data: {accessToken, message: "Login successful", type: "success"}});
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({
                        data: {message: 'Internal Server Error'}
                    });
                }
            }
            return res.status(200).json({data: {message: 'User not found', type: "error"}});
        }
    }
}