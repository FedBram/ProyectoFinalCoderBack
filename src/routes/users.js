//---------------------------MODULOS ---------------------------//

import express from 'express'

const { Router } = express;
const router = new Router();

import session from 'express-session';

import passport from 'passport';
import { Strategy } from 'passport-local';


//------------------------- IMPORTS ---------------------------------//

import sessions from './../configs/sessionsConfig.js'

import { fields, login, register } from './../configs/passportConfig.js'

import { getRegister, getRegisterErr, getLogin, getLoginErr, getLogout, getUserHome } from './../controllers/usersControllers.js'



//------------------------- MIDDLESWARES -----------------------------//

router.use(express.json());
router.use(express.urlencoded({extended:false}));


//--- MULTER PARA CARGA DE IMAGENES
import upload from '../configs/multerconfig.js';


//---------------------------- SESSIONS ----------------------------------//
//---- PERSISTENCIA EN MONGO ATLAS

router.use(session(sessions))


//----------------------------- PASSPORT ---------------------------------//

router.use(passport.initialize());
router.use(passport.session());

//-- LOGIN/REGISTER STRATEGIES
passport.use('local-login', new Strategy(fields, login))
passport.use('local-register', new Strategy(fields, register))

//-- SERIALIZE / DESERIALIZE
passport.serializeUser((user, done) => {
    done(null, user);
  });
passport.deserializeUser(  (user, done) => {
      done(null, user)
  })



//---------------------------------- RUTAS --------------------------------------//

//---- REGISTRO

router.get('/register', getRegister);
router.post('/register', upload.single('img'), passport.authenticate('local-register', {
    successRedirect: '/user-home',
    failureRedirect: '/registererror'
}));
router.get('/registererror', getRegisterErr);

//--- LOGIN

router.get('/login', getLogin);
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/user-home',
    failureRedirect: '/loginerror'
}));
router.get('/loginerror', getLoginErr);

//--- LOGOUT

router.get('/logout', getLogout);

//--- USERS HOME

router.get('/user-home', getUserHome);



export { router }