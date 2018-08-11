import express from 'express';
import jwt from '../../helpers/jwt';
// import bcrypt from 'bcrypt-nodejs';
// const UserTypes = require('./model')
import { User } from "./model";
const mongoose = require('mongoose');
mongoose.Promise = Promise;
// const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();

export class UsersModule {
    
    constructor() {
        this.model = User;
        this.router = express.Router();
        //User routes 
        this.router.route('/')
            .get(this.getAll)
  }

  /**
   * 
   * 
   * @param {any} req 
   * @param {any} res 
   * @returns 
   * @memberof UsersModule
   * Get all users
   */
    getAll(req, res) {
        return User
        .find()
        .then(users =>{
            res.json(users);
        })
        .catch(e => {
            console.log(e);
        })
    };
};