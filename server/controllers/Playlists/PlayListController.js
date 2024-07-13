import {getPrismaInstance} from "../../utils/prisma/prisma.js";


export const PlayListController = () => {
    return {
        async createNewPlaylist(req, res) {
            const {playlist} = req.body;
            try {
                const authUser = req.authUser;
                const prisma = await getPrismaInstance();

                const existingPlaylist = await prisma.playlist.findFirst({
                    where: {
                        name: playlist, userId: authUser.userid
                    }
                });

                if (existingPlaylist) {
                    return res.status(200).json({data: {message: "Playlist Already Exists", type: "error"}});
                }

                await prisma.Playlist.create({
                    data: {
                        name: playlist, user: {
                            connect: {id: authUser.userid}
                        }
                    }
                });

                return res.status(201).json({data: {message: "Playlist Created", type: "success"}});

            } catch (err) {
                console.log(err)
            }


        }, async getPlaylists(req, res) {
            try {
                const authUser = req.authUser;
                const prisma = await getPrismaInstance();

                const playlists = await prisma.playlist.findMany({
                    where: {
                        userId: authUser.userid
                    }, select: {
                        id: true, name: true, image: true, userId: true, type: true, songs: true
                    },
                });


                const playlistsWithSongIds = playlists.map(playlist => ({
                    ...playlist, songs: playlist.songs.map(song => song.id)
                }));

                return res.status(200).json({playlists: playlistsWithSongIds});

            } catch (err) {
                console.log(err);
            }
        }, async saveSongInPlaylist(req, res) {
            const {playlists, song} = req.body;
            try {
                const authUser = req.authUser;
                const prisma = await getPrismaInstance();

                const allPlaylists = await prisma.playlist.findMany({
                    where: {
                        id: {in: playlists}, userId: authUser.userid
                    }, select: {id: true, songs: true}
                });

                const updates = allPlaylists.map(async (playlist) => {
                    const songExists = playlist.songs.some(s => s.id === song.id);
                    if (!songExists) {
                        return prisma.playlist.update({
                            where: {id: playlist.id}, data: {
                                songs: {
                                    push: {...song, addedAt: new Date()},
                                }, image: song.image
                            }
                        });
                    }
                });

                await Promise.all(updates);
                res.status(200).json({
                    data: {
                        message: "Song added", type: "success"
                    }
                });
            } catch (error) {
                console.error("Error saving song to playlists:", error);
                res.status(500).json({
                    message: "An error occurred while adding the song to playlists"
                });
            }
        }, async getPlaylistSongs(req, res) {
            const {id: playlist_id} = req.params;
            try {
                const authUser = req.authUser;
                const prisma = await getPrismaInstance();

                const playlist = await prisma.playlist.findMany({
                    where: {
                        userId: authUser.userid, id: playlist_id
                    }
                });

                playlist[0]?.songs.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

                if (!playlist) return res.status(404).json({message: "Playlist not found"});

                return res.status(200).json({playlist: playlist});

            } catch (err) {
                console.log(err);
            }


        }, async removeSongFromPlaylist(req, res) {
            const {playlists, id: songId} = req.body;
            try {
                const authUser = req.authUser;
                const prisma = await getPrismaInstance();

                const allPlaylists = await prisma.playlist.findMany({
                    where: {
                        id: {in: playlists}, userId: authUser.userid
                    }, select: {id: true, songs: true}
                });

                const updates = allPlaylists.map(async (playlist) => {
                    const updatedSongs = playlist.songs.filter(s => s.id !== songId);

                    const lastSong = updatedSongs.length > 0 ? updatedSongs[updatedSongs.length - 1] : null;

                    return prisma.playlist.update({
                        where: {id: playlist.id}, data: {
                            songs: {set: updatedSongs}, image: lastSong ? lastSong.image : ""
                        }
                    });
                });

                await Promise.all(updates);
                res.status(200).json({
                    data: {
                        message: "Song removed", type: "success"
                    }
                });

            } catch (err) {
                console.log(err);
            }
        }


    }
}