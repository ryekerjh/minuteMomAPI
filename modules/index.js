import { UserModule } from './user';
import { ActivityModule } from "./activity";
// import { NotificationModule } from "./notification";
// import { PersonModule } from "./person";

/**
 * 
 * 
 * @export
 * @class Modules
 * Gathers all modules that are used and exports them to express router (in ~/helpers/bootstrap-router.js)
 */
export class Modules {
    constructor() {
        this.users = new UserModule;
        this.activities = new ActivityModule;
        // this.notifications = new NotificationModule;
        // this.people = new PersonModule;
        this.moduleList = [
            this.users,
            this.activities,
            // this.notifications,
            // this.people
        ];
    }
}