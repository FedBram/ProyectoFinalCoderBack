import ContenedorMongodb from "../../containers/containerMongodb.js";

class UserDaoMongo extends ContenedorMongodb {
    constructor(){
        super('users', {
            email: {type: String, required: true},
            password: {type: String, required: true},
            name: {type: String, required: true},
            age: {type: Number, required: true},
            adress: {type: String, required: true},
            phone: {type: String, required: true},
            img: {type: String, required: true}
        })
    }
}

export default UserDaoMongo