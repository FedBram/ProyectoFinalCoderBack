import ContenedorMongodb from "../../containers/containerMongodb.js";

class CartDaoMongo extends ContenedorMongodb {
    constructor(){
        super('carritos', {
            timeStamp: {type: String},
            productos: {type: [], required: true}
        })
    }
}

export default CartDaoMongo