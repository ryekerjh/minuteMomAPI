import express from 'express';
import * as _ from "lodash";
import { isAdmin } from "../../helpers/protectRoutes";
import { Activity } from "./model";
import { Person } from "../person/model";
const mongoose = require('mongoose');
mongoose.Promise = Promise;

export class ActivityModule {

    constructor() {
        this.model = Activity;
        this.router = express.Router();
        //Activity routes 
        this.router.route('/')
            .post(isAdmin, this.createActivity)
    }

    /**
     * 
     *
     */
    async createActivity(req, res, next) {
        try {
            const createdActivity = await Activity.save(req.body.activity);
            if (createdActivity) res.status(201).send(createdActivity);
        } catch (error) {
            next(error);
        }
    };
};