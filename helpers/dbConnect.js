export function dbConnect (app) {
    const mongoose = require('mongoose');
    require('dotenv').config();
    
        mongoose.connect(process.env.DBURL, {
            dbName: "minute-mom",
            useNewUrlParser: true,
            // auth: {
            //     user: process.env.DBUSER,
            //     password: process.env.DBPASSWORD
            // }
        });
        mongoose.connection.on('connected',() => {
            console.log('db connection established');
        })
        return app;
    }