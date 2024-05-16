import jwt from 'jsonwebtoken';


const Auth = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.json({message: "Authentication Failed "});
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        if (decoded.role === "customer" || decoded.role === "admin") {
            next();
        } else {
            return res.json({message: "Authentication Failed"});
        }
    } catch (error) {
        return res.json({message: "Error in Authentication"});
    }

}

export default Auth;