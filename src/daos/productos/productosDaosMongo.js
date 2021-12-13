import ContenedorMongodb from "../../containers/containerMongodb.js";

class ProductosDaoMongo extends ContenedorMongodb {
    constructor(){
        super('productos', {
            title: { type: String, required: true},
            artist: { type: String, required: true},
            price: { type: Number, required: true},
            img: { type: String, required: true},
            Stock: { type: Number, required: true},
            timeStamp: { type: String}
        })
    }
}

export default ProductosDaoMongo