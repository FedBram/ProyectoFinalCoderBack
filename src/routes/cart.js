//---------------------------MODULOS ---------------------------//

import express from 'express'

const { Router } = express;
const router = new Router();

import session from 'express-session';

import passport from 'passport';


//------------------------- IMPORTS ---------------------------------//

import sessions from './../configs/sessionsConfig.js'

import { postCart, deleteCart, addCartProd, getCart, deleteCartProd, postBuy, all } from './../controllers/cartControllers.js'

//------------------------- MIDDLESWARES -----------------------------//

router.use(express.json());
router.use(express.urlencoded({extended:false}));

//---- PERSISTENCIA EN MONGO ATLAS

router.use(session(sessions))

router.use(passport.initialize());
router.use(passport.session());

//--- AUTENTICACION DE RUTAS

// import { auth as auth} from './auth.js';
import auth from '../configs/authMiddleware.js';


//----------------------------------RUTAS --------------------------------------//

router.get('/all', all)

//---- CREAR UN CARRITO

router.post('/', auth, postCart)

//--- ELIMINAR UN CARRITO

router.delete('/:id', auth, deleteCart)

//-- AGREGAR PRODUCTOS A UN CARRITO

router.post("/:id/productos/:id_prod", auth, addCartProd)

//--- MOSTRAR PRODUCTOS EN UN CARRITO

router.get('/:id', auth, getCart)

//--- ELMINAR PRODUCTO DE UN CARRITO

router.delete('/:id/productos/:id_prod', auth, deleteCartProd)

//--- FINALIZAR COMPRA

router.post('/buy/:id', auth, postBuy)


export { router }