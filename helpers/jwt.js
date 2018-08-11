import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';  
import User from '../modules/user/model';
require('dotenv').config();
const secret = process.env.JWT_SECRET;

function sign(payload, secret){

    const jwtToken = jwt.sign(payload, secret, {noTimestamp: true});
    return jwtToken;
}

function verify(token){  
    try{
        return jwt.verify(token, secret);
    } catch(err){
        return null;
    }
}

function protect(req, res, next) {
    if(req) {          
        if(!req.headers.authorization) {
            res.status(401);
            return res.json({error: 'Missing authorization header'});
        } else if(req.headers.authorization) {
            const user = verify(req.headers.authorization.split(' ')[1]);
            if(!user) {
                res.status(401);
                return res.json({error: 'Invalid authorization header'});
            }
            User.findOne({_id: user._id})
            .select('-password -__v')
            .exec()
            .then(user => {
                req.current_user = user;
                next();
            })
            .catch(err => {
                console.log(err, 'error');
            });
        }
    }
};

function stripRole(req, res, next) {
    if(req.body) {
        if(req.body.hasOwnProperty('role')) {
            if(req.current_user !== 'superadmin') {
                delete req.body.role;
                next();
            } else {
                next();
            }
        }
    }
};

module.exports = {
    sign: sign,
    verify: verify,
    protect: protect,
    stripRole: stripRole
};