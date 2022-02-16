//---------------------------MODULOS ---------------------------//

import express from 'express'

const { Router } = express;
const router = new Router();

import session from 'express-session';
import MongoStore from 'connect-mongo';

import passport from 'passport';

import dotenv from 'dotenv';
dotenv.config();



//------------------------- IMPORTS ---------------------------------//

import { 
    productsDao as productosApi, 
    cartsDao as cartsApi
} from './../src/daos/index.js';

//--- IMPRESOR DE FECHA Y HORA
import timeStamp from "../src/util/timeStamp.js";

//--- NODEMAILER
import {
    transporter as transporter,
    newBuyMail as newBuyMail
} from './../src/util/mailconfig.js';

//--- TWILIO
import client from './../src/util/twilioconfig.js'


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

router.get('/all', async (req, res) => {
    let productos = await productosApi.getAll();
    let carritos = await cartsApi.getAll();
    res.send({Productos: productos, Carritos: carritos});
})


//---- CREAR UN CARRITO
router.post("/", auth, async (req, res) => {
    await cartsApi.create({timeStamp: timeStamp, productos: []});
    res.send("Carrito creado")
})

//--- ELIMINAR UN CARRITO
router.delete('/:id', auth, async (req, res) => {
    await cartsApi.deleteById(req.params.id);
    res.send("Carrito eliminado")
})

//-- AGREGAR PRODUCTOS A UN CARRITO
router.post("/:id/productos/:id_prod", auth, async (req, res) => {
    let producto = await productosApi.getById(req.params.id_prod);
    await cartsApi.addToCart(producto, req.params.id)
    res.send("Producto agregado al carrito")
})

//--- MOSTRAR PRODUCTOS EN UN CARRITO
router.get("/:id", auth, async (req, res) => {
    let data = await cartsApi.getAll();
    let products = [];
    data.forEach((i) => {
        if(i.id == req.params.id){
            i.productos.forEach((e) => {
                products.push(e)
            })
        }
    })
    res.render('carrito', {data: products})
})

//--- ELMINAR PRODUCTO DE UN CARRITO
router.delete("/:id/productos/:id_prod", auth, async (req, res) => {
    let producto = await productosApi.getById(req.params.id_prod);
    await cartsApi.deleteProdCart(producto, req.params.id)
    res.send("Producto eliminado")
})


//--- FINALIZAR COMPRA
router.post('/buy/:id', auth, async (req, res) => {
    let user = req.session.passport.user;
    let data = await cartsApi.getAll();
    let products = [];
    data.forEach((i) => {
        if(i.id == req.params.id){
            i.productos.forEach((e) => {
                products.push(e)
            })
        }
    })
    //--ENVIO DE MAIL Y WHATSAPP AL ADMIN
    await transporter.sendMail(newBuyMail(user, products))
    await client.messages.create({
        body: `Nuevo pedido de ${user.name}, ${user.email}`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${process.env.ADMIN_PHONE}`
    });
    
    //--- ENVIO DE SMS AL NUMERO QUE REGISTRO EL USUARIO. (COMENTADO AL NO PODER SER USADO EN CUENTA GRATUITA DE TWILIO) ---//
    // await client.messages.create({
    //     body: 'Estamos preparando su pedido',
    //     from: '+19402363674',
    //     to: `${user.phone}`
    // })
    res.send('pedido enviado')
})

export { router }