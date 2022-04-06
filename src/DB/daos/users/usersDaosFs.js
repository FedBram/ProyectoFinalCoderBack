import ContenedorFs from "../../containers/containerFS.js";

class UsersDaosFs extends ContenedorFs {

    constructor() {
        super('users.json')
    }
}

export default UsersDaosFs