import jwt from "jsonwebtoken";

export const extractAndVerifyToken = (authHeader) => {
    if (!authHeader) {
        return false;
    }
    const token = authHeader.split(' ')[1];

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
        primaryArtists: item.artists.primary.map(artist => artist.name).join(', ')
    };
};
