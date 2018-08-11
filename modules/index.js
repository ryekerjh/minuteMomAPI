import { UsersModule } from './user';


/**
 * 
 * 
 * @export
 * @class Modules
 * Gathers all modules that are used and exports them to express router (in ~/helpers/bootstrap-router.js)
 */
export class Modules {
    constructor() {
        this.users = new UsersModule;
        this.moduleList = [
            this.users
            ];
    }
}