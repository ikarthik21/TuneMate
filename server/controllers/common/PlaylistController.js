import {getPrismaInstance} from "../../utils/prisma/prisma.js";

export const PlaylistController = () => {
    return {
        async getRecommended(req, res) {
            try {

                const prisma = await getPrismaInstance();

                const playlists = await prisma.recommended.findMany({
                    select: {
                        id: true, name: true, image: true, type: true, songs: true
                    },
                });


                const playlistsWithSongIds = playlists.map(playlist => ({
                    ...playlist, songs: playlist.songs.map(song => song.id)
                }));

                return res.status(200).json({playlists: playlistsWithSongIds});

            } catch (err) {
                console.log(err);
            }

        }
    }
}