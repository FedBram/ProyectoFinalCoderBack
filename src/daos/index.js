let productsDao;
let cartsDao;

let persis = "firebase";

switch (persis) {
    case 'json' :
        const { default: ProductosDaosFs } = await import('./productos/productosDaosFs.js');
        const { default: CartDaosFs } = await import('./carts/cartsDaosFs.js');

        productsDao = new ProductosDaosFs();
        cartsDao = new CartDaosFs();
        break;
    case 'mongodb':
        const { default: ProductosDaoMongo } = await import('./productos/productosDaosMongo.js');
        const { default: CartDaoMongo } = await import('./carts/cartsDaosMongo.js');

        productsDao = new ProductosDaoMongo();
        cartsDao = new CartDaoMongo();
        break;
    case 'firebase' :
        const { default: ProductosDaosFirebase } = await import('./productos/productosDaosFirebase.js');
        const { default: CartsDaosFirebase } = await import('./carts/cartDaosFirebase.js');

        productsDao = new ProductosDaosFirebase;
        cartsDao = new CartsDaosFirebase;
        break;
};

export { productsDao, cartsDao };