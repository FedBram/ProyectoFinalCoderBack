//------MODULOS -----//
import express from 'express'


const { Router } = express;
const router = new Router();


//-------- IMPORTS -------//
import { 
    productsDao as productosApi, 
    cartsDao as cartsApi
} from './../src/daos/index.js'

import timeStamp from "./../src/timeStamp.js"

//-----------//
router.use(express.json());
router.use(express.urlencoded({extended:false}));

//-----RUTAS ------//

//---- CREAR UN CARRITO
router.post("/", async (req, res) => {
    await cartsApi.create({timeStamp: timeStamp, productos: []});
    res.send("Carrito creado")
})

//--- ELIMINAR UN CARRITO
router.delete('/:id', async (req, res) => {
    await cartsApi.deleteById(req.params.id);
    res.send("Carrito eliminado")
})

//-- AGREGAR PRODUCTOS A UN CARRITO
router.post("/:id/productos/:id_prod", async (req, res) => {
    let producto = await productosApi.getById(req.params.id_prod);
    await cartsApi.addToCart(producto, req.params.id)
    res.send("Producto agregado al carrito")
})

//--- MOSTRAR PRODUCTOS EN UN CARRITO
router.get("/:id", async (req, res) => {
    let data = await cartsApi.getAll();
    let products = [];
    data.forEach((i) => {
        if(i.id == req.params.id){
            i.productos.forEach((e) => {
                products.push(e)
            })
        }
    })
    res.send(products)
})

//--- ELMINAR PRODUCTO DE UN CARRITO
router.delete("/:id/productos/:id_prod", async (req, res) => {
    let producto = await productosApi.getById(req.params.id_prod);
    await cartsApi.deleteProdCart(producto, req.params.id)
    res.send("Producto eliminado")
})

export { router }