import { extractFields } from "../../utils/serverutils.js";
import { getPrismaInstance } from "../../utils/prisma/prisma.js";
import MusicServiceInstance from "../../service/api/api.js";

export const UserMetaController = () => {
  return {
    async manageUserFavorites(req, res) {
      try {
        const { id: songId } = req.body;
        const { userid } = req.authUser;
        const prisma = await getPrismaInstance();

        // Fetch the user's favorites
        const userFavorites = await prisma.Favorites.findFirst({
          where: { userId: userid },
          select: { id: true, favorites: true }
        });

        // If user has no favorites, create a new entry
        if (!userFavorites) {
          const song = await MusicServiceInstance.getSingleSong(songId);
          const { id, name, duration, imageUrl, primaryArtists } =
            extractFields(song);

          await prisma.Favorites.create({
            data: {
              userId: userid,
              favorites: [{ id, name, duration, imageUrl, primaryArtists }]
            }
          });

          return res
            .status(200)
            .json({ message: "Favorite added successfully", type: "success" });
        }

        // Check if the song is already in the favorites
        const isSongInFavorites = userFavorites.favorites.some(
          (song) => song.songId === songId
        );

        const song = await MusicServiceInstance.getSingleSong(songId);
        const { id, name, duration, imageUrl, primaryArtists } =
          extractFields(song);

        if (isSongInFavorites) {
          // If the song is already in favorites, remove it
          await prisma.Favorites.update({
            where: { id: userFavorites.id },
            data: {
              favorites: {
                set: userFavorites.favorites.filter(
                  (song) => song.songId !== songId
                )
              }
            }
          });

          return res
            .status(200)
            .json({ message: "Removed from Favorites", type: "success" });
        } else {
          // If the song is not in favorites, add it
          await prisma.Favorites.update({
            where: { id: userFavorites.id },
            data: {
              favorites: {
                push: { id, songId, name, duration, imageUrl, primaryArtists }
              }
            }
          });
          return res
            .status(200)
            .json({ message: "Added to Favorites successfully", type: "success" });
        }
      } catch (error) {
        const status = error.message.includes("token") ? 401 : 500;
        console.log(error.message);
        return res.status(status).json({ message: error.message });
      }
    },
    async getFavorites(req, res) {
      const { userid } = req.authUser;
      const prisma = await getPrismaInstance();
      if (!userid) {
        return res.status(404).json({ message: "User not found" });
      }
      try {
        const userFavorites = await prisma.Favorites.findFirst({
          where: { userId: userid },
          select: { favorites: true }
        });

        let reversedFavorites = [];
        if (userFavorites) {
          reversedFavorites = userFavorites.favorites.reverse();
        }

        return res.status(200).json({
          message: "Favorites Fetch Successful",
          favorites: reversedFavorites
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    },
    async updatePlayerState(req, res) {
      const authUser = req.authUser;

      if (!authUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { state } = req.body;

      if (!state || typeof state !== "object") {
        return res.status(400).json({ error: "Invalid state" });
      }

      try {
        const prisma = await getPrismaInstance();
        const updatedUser = await prisma.User.update({
          where: {
            id: authUser.userid
          },
          data: {
            playerState: {
              ...(
                await prisma.User.findUnique({
                  where: { id: authUser.userid },
                  select: { playerState: true }
                })
              ).playerState,
              ...state
            }
          }
        });
        res.json(updatedUser.playerState);
      } catch (error) {
        console.error("Error updating player state:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
    async getPlayerState(req, res) {
      const authUser = req.authUser;
      const prisma = await getPrismaInstance();

      const { playerState } = await prisma.User.findFirst({
        where: {
          id: authUser.userid
        },
        select: {
          playerState: true
        }
      });

      return res.status(200).json({ playerState: playerState });
    },
    async getUserSongHistory(req, res) {
      try {
        const { userid } = req.authUser;
        const prisma = await getPrismaInstance();

        const userHistory = await prisma.History.findFirst({
          where: { userId: userid },
          select: { history: true }
        });

        return res.status(200).json(userHistory);
      } catch (e) {
        console.error("Error Fetching Song History:", e);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
    async addSongToHistory(req, res) {
      try {
        const { userid } = req.authUser;
        const { song } = req.body;
        const prisma = await getPrismaInstance();

        const userHistory = await prisma.History.findFirst({
          where: { userId: userid },
          select: { history: true, id: true }
        });

        if (!userHistory) {
          await prisma.History.create({
            data: {
              userId: userid,
              history: [song]
            }
          });
          return res
            .status(200)
            .json({ message: "Song added to history", type: "success" });
        }

        let history = userHistory.history || [];

        if (history.length > 20) {
          history.pop();
        }

        const existingIndex = history.findIndex((item) => item.id === song.id);
        if (existingIndex > -1) {
          history.splice(existingIndex, 1);
        }
        history.unshift(song);
        await prisma.History.update({
          where: { id: userHistory.id },
          data: { history: history }
        });
        res
          .status(200)
          .json({ message: "Song added to history", type: "success" });
      } catch (e) {
        console.error("Error adding song to history:", e);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
};
