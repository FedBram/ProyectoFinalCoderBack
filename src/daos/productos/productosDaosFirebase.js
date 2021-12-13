import ContainerFirebase from "../../containers/containerFirebase.js";

class ProductosDaosFirebase extends ContainerFirebase{
    constructor(){
        super("productos")
    }
}

export default ProductosDaosFirebase