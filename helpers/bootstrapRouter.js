import express from 'express';

export function BootstrapRouter (app, modules) {

let router = express.Router();
    modules.moduleList.forEach(module => {
        let moduleName = module.constructor.name.replace("Module", "").toLowerCase();
        app.use(`/api/${moduleName}`, module.router)
    })
    return app;
}