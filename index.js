import express from 'express';
import bodyParser from 'body-parser';
import { Modules } from './modules';
import { BootstrapRouter } from './helpers/bootstrapRouter';
import { dbConnect } from './helpers/dbConnect';
import { normalizePort } from './helpers/normalizePort';
// import { configCors } from './helpers/cors';
let morgan = require('morgan');
// let methodOverride = require('method-override');
require('dotenv').config();
import { protectRoutes } from "./helpers/protectRoutes";


//Set up express as the router, grab port from .env file
let app = express();
const port = normalizePort(process.env.PORT || '3003');

//Use Morgan for dev environment, Use bodyParser for reqs
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }))
app.use(async (req, res, next) =>
    await protectRoutes(req, res, next)
);

//Use helper fns to bootstrap the modules, connect to db, and config CORS
app = dbConnect(app);
// app = configCors(app);
app = BootstrapRouter(app, new Modules);

app.use((error, req, res, next) => {
    console.error(
        `${error}\nRequest Method: ${req.method}\nRequest Path: ${
        req.path
        }\nRequest Body: ${JSON.stringify(
            req.body
        )}\nRequest Params: ${JSON.stringify(req.params)}`
    );
    error.status = error.status || 500;
    res.status(error.status);
    res.send({
        title: "Error Response",
        message: error.message,
        error: error,
    });
});

//set server to listen on port
const server = require('http').Server(app);
server.listen(port, function () {
    console.log('The Server is running at', port);
});

module.exports = app;