//------MODULOS -----//
import express from 'express'


const { Router } = express;
const router = new Router();

//-------- IMPORTS -------//
import { productsDao as productosApi } from './../src/daos/index.js'

//-----------//
router.use(express.json());
router.use(express.urlencoded({extended:false}));


//-----RUTAS ------//

//--MUESTRA PRODUCTOS
router.get("/", async (req, res) => {
  res.json(await productosApi.getAll());
});

//--AGREGA PRODUCTOS
router.post("/", async (req,res) => {
  if(req.query.admin){
    await productosApi.create(req.body);
    res.send('Producto agregado');
  }else {
    res.send({error:"", descripcion: "ruta 'api/productos/' metodo 'post' no autorizada"})
  }
})

//--MUESTRA UN UNICO PRODUCTO SEGUN ID
router.get("/:id", async (req, res) => {
  let productExist = await productosApi.getById(req.params.id);
  if (productExist != null){
    res.send(productExist)
  }else {
    res.send({error: "Producto no encontrado"})
  }
})

//---MODIFICAR UN PRODUCTO
router.put("/:id", async (req, res) => {
  if(req.query.admin){
      await productosApi.saveById(req.body, req.params.id);
    res.send("Producto modificado")
  }else {
    res.send({error:"", descripcion: `ruta api/productos/${req.params.id} metodo 'put' no autorizada`})
  }
})

//---ELIMINAR UN PRODUCTO
router.delete("/:id", async (req, res) => {
  if(req.query.admin){
    await productosApi.deleteById(req.params.id);
    res.send("Producto eliminado")
  }else {
    res.send({error:"", descripcion: `ruta api/productos/${req.params.id} metodo 'delete' no autorizada`})
  }
})



export { router }