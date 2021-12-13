import ContenedorFs from '../../containers/containerFS.js';

class CartDaosFs extends ContenedorFs {

    constructor(){
        super('carritos.json')
    }
}

export default CartDaosFs