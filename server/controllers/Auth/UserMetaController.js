import {extractFields, isAuthUser} from "../../utils/serverutils.js";
import {getPrismaInstance} from "../../utils/prisma/prisma.js";
import MusicServiceInstance from "../../service/api/api.js";

export const UserMetaController = () => {
    return {
        async manageUserFavorites(req, res) {
            const {id: songId} = req.body;

            try {
                const authUser = isAuthUser(req);
                const prisma = await getPrismaInstance();
                const user = await prisma.User.findUnique({
                    where: {id: authUser.userid}
                });
                if (!user) {
                    return res.status(404).json({message: "User not found"});
                }
                const isFavorite = user.favoriteSongs.some(song => song === songId);
                await prisma.User.update({
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

            if (!authUser) {
                return res.status(404).json({message: "User not found"});
            }

            const {favoriteSongs} = await prisma.User.findUnique({
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
        }, async updatePlayerState(req, res) {
            const authUser = isAuthUser(req);

            if (!authUser) {
                return res.status(401).json({error: 'Unauthorized'});
            }

            const {state} = req.body;

            if (!state || typeof state !== 'object') {
                return res.status(400).json({error: 'Invalid state'});
            }

            try {
                const prisma = await getPrismaInstance();
                const updatedUser = await prisma.User.update({
                    where: {
                        id: authUser.userid
                    }, data: {
                        playerState: {

                            ...(await prisma.User.findUnique({
                                where: {id: authUser.userid}, select: {playerState: true}
                            })).playerState, ...state
                        }
                    }
                });
                res.json(updatedUser);
            } catch (error) {
                console.error('Error updating player state:', error);
                res.status(500).json({error: 'Internal server error'});
            }
        }, async getPlayerState(req, res) {
            const authUser = isAuthUser(req);
            const prisma = await getPrismaInstance();

            const {playerState} = await prisma.User.findFirst({
                where: {
                    id: authUser.userid
                }, select: {
                    playerState: true
                }
            })


            return res.status(200).json({playerState: playerState});
        }

    }
}