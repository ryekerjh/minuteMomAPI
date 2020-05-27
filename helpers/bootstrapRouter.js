import express from 'express';
import * as jwt from "../helpers/jwt";

export function BootstrapRouter(app, modules) {

    let router = express.Router();

    modules.moduleList.forEach(module => {
        let moduleName = module.constructor.name.replace("Module", "").toLowerCase(),
            routeIdentifier = `/api/v1/${moduleName}`;
        app.use(routeIdentifier, module.router)
    })
    return app;
}