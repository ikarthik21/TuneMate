import jwt from "jsonwebtoken";

export const extractAndVerifyToken = (authHeader) => {
    if (!authHeader) {
        throw new Error('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new Error('Token missing');
    }
    try {
        return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        throw new Error('Invalid token');
    }
};

export const isAuthUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const authUser = extractAndVerifyToken(authHeader)
    if (!authUser) return res.status(404).json({message: "Invalid Request"});
    return authUser;
}


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
