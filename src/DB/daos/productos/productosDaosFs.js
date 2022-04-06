import ContenedorFs from "../../containers/containerFS.js";

class ProductosDaosFs extends ContenedorFs {
    
    constructor() {
        super('productos.json')
    }
    
}
export default ProductosDaosFs