import { User } from '../modules/user/model';
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

async function sign(payload, tokenHash) {
    const jwtToken = await jwt.sign(payload, tokenHash + secret, { noTimestamp: true });
    return jwtToken;
}

function verify(token, userHash) {
    try {
        return jwt.verify(token, userHash + secret);
    } catch (err) {
        throw err;
    }
}

async function protect(req, res, next) {
    if (req) {
        try {
            const token = req.headers["x-access-token"],
                json = !!token ? token.split(".")[1] : undefined,
                decoded = JSON.parse(Buffer.from(json, "base64").toString("ascii")),
                lookupUser = decoded.id ? await User.findById(decoded.id).select("+tokenHash") : null;
            const userInHeaders = verify(token, lookupUser.tokenHash);
            if (!userInHeaders) {
                res.status(401);
                return res.json({ error: 'Invalid authorization header' });
            }
            req.current_user = await User.findOne({ _id: userInHeaders.id })
                .select('-__v')
            next();
        } catch (error) { next(error) }
    }
    else throw new Error("No request sent")
};

/**
 * TO be used for updateUser
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function stripRole(req, res, next) {
    if (req.body) {
        if (req.body.hasOwnProperty('role') && req.current_user.role !== 'superadmin') {
            delete req.body.role;
            next();
        } else {
            next();
        }
    } else throw new Error(`You must provide a payload`)
};

export {
    sign,
    verify,
    protect,
    stripRole
};