import {getPrismaInstance} from "../../utils/prisma/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {isAuthUser, extractFields} from "../../utils/serverutils.js";
import MusicServiceInstance from '../../service/api/api.js';


export const UserController = () => {
    return {
        async register(req, res) {
            const {email, username, password} = req.body;

            const prisma = await getPrismaInstance();

            try {
                const existingUserByEmail = await prisma.users.findUnique({where: {email}});

                const existingUserByUsername = await prisma.users.findUnique({where: {username}});

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
                await prisma.users.create({
                    data: {
                        email: email, username: username, password: hashedPassword
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
        }, async login(req, res) {
            const {email, password} = req.body;
            const prisma = await getPrismaInstance();
            const user = await prisma.users.findUnique({where: {email}});
            if (user) {
                try {
                    const userid = user.id;
                    const result = await bcrypt.compare(password, user.password);
                    if (!result) {
                        return res.status(200).json({
                            data: {message: 'Wrong Username or Password', type: "error"}
                        });
                    }
                    const accessToken = jwt.sign({userid: userid, username: user.username}, process.env.TOKEN_SECRET);
                    return res.status(200).json({data: {accessToken, message: "Login successful", type: "success"}});
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({
                        data: {message: 'Internal Server Error'}
                    });
                }
            }
            return res.status(200).json({data: {message: 'User not found', type: "error"}});
        }, async manageUserFavorites(req, res) {
            const {id: songId} = req.body;

            try {
                const authUser = isAuthUser(req);
                const prisma = await getPrismaInstance();
                const user = await prisma.users.findUnique({
                    where: {id: authUser.userid}
                });
                if (!user) {
                    return res.status(404).json({message: "User not found"});
                }
                const isFavorite = user.favoriteSongs.some(song => song === songId);
                await prisma.users.update({
                    where: {id: authUser.userid}, data: {
                        favoriteSongs: {
                            set: isFavorite ? user.favoriteSongs.filter((song) => song !== songId.toString()) : [...user.favoriteSongs, songId.toString()]
                        },
                    },
                });
                return res.status(200).json({
                    message: isFavorite ? "Removed from Favorites" : "Added to Favorites", type: "success"
                });
            } catch (error) {
                const status = error.message.includes("token") ? 401 : 500;
                console.log(error.message);
                return res.status(status).json({message: error.message});
            }


        }, async getFavorites(req, res) {
            const authUser = isAuthUser(req);
            const prisma = await getPrismaInstance();

            const {favoriteSongs} = await prisma.users.findUnique({
                where: {id: authUser.userid}, select: {
                    favoriteSongs: true
                }
            });


            try {
                const favorites = [];

                const songFetchPromises = favoriteSongs.map(async (songId, index) => {
                    const reversedIndex = favoriteSongs.length - 1 - index;
                    const reversedSongId = favoriteSongs[reversedIndex];

                    try {
                        const song = await MusicServiceInstance.getSingleSong(reversedSongId);
                        return extractFields(song);
                    } catch (fetchError) {
                        console.error(`Error fetching song with ID ${reversedSongId}:`, fetchError);
                    }
                });

                const fetchedSongs = await Promise.all(songFetchPromises);

                favorites.push(...fetchedSongs);

                return res.status(200).json({message: "Favorites Fetch Successful", favorites});

            } catch (error) {
                console.error("Error Occurred", error);
                return res.status(500).json({message: "Internal Server Error"});
            }
        },
        async checkInFavorites(req, res) {
            const authUser = isAuthUser(req);
            const {id} = req.body;
            const prisma = await getPrismaInstance();

            const isFavorite = !!await prisma.users.findFirst({
                where: {
                    id: authUser.userid, favoriteSongs: {
                        has: id
                    }
                }
            });

            return res.status(200).json({isFavorite: isFavorite});
        }
    }
}