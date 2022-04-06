//---------------------------MODULOS ---------------------------//

import express from 'express';

const { Router } = express;
const router = new Router();

import session from 'express-session';

import passport from 'passport';



//------------------------- IMPORTS ---------------------------------//

import sessions from './../configs/sessionsConfig.js'

import { getProducts, getOneProduct, postProduct, putProduct, deleteProduct, getProductsAdmin } from './../controllers/productosControllers.js'

//------------------------- MIDDLESWARES -----------------------------//

router.use(express.json());
router.use(express.urlencoded({extended:false}));

//---- PERSISTENCIA EN MONGO ATLAS

router.use(session(sessions))

router.use(passport.initialize());
router.use(passport.session());

//--- AUTENTICACION DE RUTAS

import auth from '../configs/authMiddleware.js';
import authAdmin from './../configs/authAdminMiddleware.js'

//----------------------------------RUTAS --------------------------------------//

//--MUESTRA PRODUCTOS
router.get('/', auth, getProducts)
router.get('/admin', authAdmin, getProductsAdmin)


//--AGREGA PRODUCTOS

router.post('/admin', authAdmin, postProduct)

//--MUESTRA UN UNICO PRODUCTO SEGUN ID

router.get('/:', getOneProduct)

//---MODIFICAR UN PRODUCTO

router.put('/admin/:id', authAdmin, putProduct)

//---ELIMINAR UN PRODUCTO

router.delete('/admin/:id', authAdmin, deleteProduct)



export { router }