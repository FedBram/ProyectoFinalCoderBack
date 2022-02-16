//---------------------------MODULOS ---------------------------//

import express from 'express';

const { Router } = express;
const router = new Router();

import session from 'express-session';
import MongoStore from 'connect-mongo';

import passport from 'passport';

import dotenv from 'dotenv';
dotenv.config();



//------------------------- IMPORTS ---------------------------------//

import { productsDao as productosApi } from './../src/daos/index.js'


//------------------------- MIDDLESWARES -----------------------------//

router.use(express.json());
router.use(express.urlencoded({extended:false}));

//---- PERSISTENCIA EN MONGO ATLAS
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}
router.use(session({
    secret: `${process.env.SECRET}`,
    resave: true,
    cookie: {
        maxAge: 60*60*1000
    },
    saveUninitialized: false,    
    // rolling: true,
    store: MongoStore.create({
        mongoUrl:`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.mtgsl.mongodb.net/ecommerce?retryWrites=true&w=majority`,
        mongoOptions: advancedOptions
    }),
}))

router.use(passport.initialize());
router.use(passport.session());

//--- AUTENTICACION DE RUTAS

import { auth as auth} from './auth.js';

//----------------------------------RUTAS --------------------------------------//

//--MUESTRA PRODUCTOS
router.get("/", auth, async (req, res) => {
  let data = await productosApi.getAll()
  res.render('productos', {data: data});
});

//--AGREGA PRODUCTOS
router.post("/", async (req,res) => {
  if(req.query.admin){
    await productosApi.create(req.body);
    res.send('Producto agregado');
  }else {
    res.send({error:"", descripcion: "ruta 'productos/' metodo 'post' no autorizada"})
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
    res.send({error:"", descripcion: `ruta productos/${req.params.id} metodo 'put' no autorizada`})
  }
})

//---ELIMINAR UN PRODUCTO
router.delete("/:id", async (req, res) => {
  if(req.query.admin){
    await productosApi.deleteById(req.params.id);
    res.send("Producto eliminado")
  }else {
    res.send({error:"", descripcion: `ruta productos/${req.params.id} metodo 'delete' no autorizada`})
  }
})



export { router }