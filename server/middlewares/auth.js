import {extractAndVerifyToken} from "../utils/serverutils.js";


export const isAuthUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const authUser = extractAndVerifyToken(authHeader);
    if (!authUser) {
        return res.status(401).json({message: "Invalid Request"});
    }
    req.authUser = authUser
    next();
};


export const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const authUser = extractAndVerifyToken(authHeader);
    if (!authUser) {
        return res.status(401).json({message: "Invalid Request"});
    }
    if (authUser.role !== "admin") {
        return false;
    }
    req.authUser = authUser
    next();
};
