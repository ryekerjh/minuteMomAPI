import express from 'express';
import jwt from '../../helpers/jwt';
import * as _ from "lodash";
// import bcrypt from 'bcrypt-nodejs';
// const UserTypes = require('./model')
const rand = require("randomatic");
import { User } from "./model";
const mongoose = require('mongoose');
mongoose.Promise = Promise;
// const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();

export class UserModule {

    constructor() {
        this.model = User;
        this.router = express.Router();
        //User routes 
        this.router.route('/')
            .get(this.getAll)
        this.router.route("/login")
            .post(this.login)
        this.router.route("/register")
            .post(this.createUser)
    }

    /**
     * 
     * 
     * @param {any} req 
     * @param {any} res 
     * @returns 
     * @memberof UserModule
     * Get all users
     */
    getAll(req, res, next) {
        return User
            .find({ deletedAt: null })
            .select("-tokenHash -salt -resetHash")
            .then(users => {
                res.json(users);
            })
            .catch(e => {
                console.log(e);
            })
    };

    /**
   *
   * @param {*} credentials
   * Log user in with auth and protections
   */
    async login(req, res, next) {
        const credentials = req.body;
        try {
            const foundUser = await User.findOne({
                email: credentials.email
            }).select("+hash +salt +tokenHash")
                .populate("preferredCategory");
            if (!foundUser) {
                throw { error: "Email not found. Please create an account" };
            }
            const validPassword = foundUser.validatePassword(
                credentials.password,
                foundUser.hash,
                foundUser.salt
            );
            if (!validPassword) {
                throw { error: "Password is incorrect" };
            }
            const [token, refreshToken] = await foundUser.generateTokens("token");
            res.set({
                "X-Access-Token": token,
                "X-Refresh-Token": refreshToken
            })
                .status(200)
                .json(_.omit(foundUser.toObject(), ["hash", "salt", "tokenHash", "resetHash"]));
        } catch (error) {
            res.status(401).json(error);
        }
    }

    /**
     *
     * @param {*} newUser
     * Register a user
     */
    async createUser(req, res) {
        try {
            const newUser = req.body;
            const foundUser = await User.findOne({
                $or: [
                    {
                        email: newUser.email
                    }, {
                        userName: newUser.userName
                    }
                ]
            });
            if (foundUser) {
                throw { error: "That email or username already has a user. Enter an email and username that isn't connected to an account, or reset your password." };
            }
            if (newUser.profile) {
                User.saveProfile(newUser.profile);
            }
            const hashObject = User.setPassword(newUser.password);
            newUser.hash = hashObject.hash;
            newUser.salt = hashObject.salt;
            newUser.tokenHash = rand("Aa0", 32);
            const createdUser = await User.create(newUser);
            const [token, refreshToken] = await createdUser.generateTokens("token");
            createdUser.token = token;
            createdUser.refreshToken = refreshToken;
            res.json(createdUser);
        } catch (e) {
            res.status(401).json(e);
        }
    }
};