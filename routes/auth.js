//---------------------------MODULOS ---------------------------//

import express from 'express'

const { Router } = express;
const router = new Router();

import session from 'express-session';
import MongoStore from 'connect-mongo';

import passport from 'passport';
import { Strategy } from 'passport-local';

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from "bcryptjs";


//------------------------- IMPORTS ---------------------------------//

import {usersDao as usersApi} from './../src/daos/index.js';

//--- LOGGERS
import {
    loggerConsole as loggerConsole,
    loggerWarn as loggerWarn,
    loggerError as loggerError
} from './../src/util/logger.js'

//--- NODEMAILER
import {
    transporter as transporter,
    newRgisterMail as newRgisterMail
} from './../src/util/mailconfig.js'



//------------------------- MIDDLESWARES -----------------------------//

router.use(express.json());
router.use(express.urlencoded({extended:false}));

//--- AUTENTICACION DE LOGIN
const auth = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }else{
        const error = {
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: `Unauthorized`
        };
        loggerConsole.error(error);
        loggerError.error(error)
        return res.status(401).send(error)
    }
}

//--- MULTER PARA CARGA DE IMAGENES

import upload from '../src/util/multerconfig.js';


//---------------------------- SESSIONS ----------------------------------//
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


//----------------------------- PASSPORT ---------------------------------//

router.use(passport.initialize());
router.use(passport.session());

//-- LOGIN
passport.use('local-login', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    let data = await usersApi.getAll();
    let userExist = data.find(i => i.email == email);
    if(!userExist){
        const error = {
            url: req.originalUrl,
            method: req.method,
            status: 403,
            error: `User not found`
        };
        loggerConsole.error(error);
        loggerError.error(error)
        return done(null, false)
    }else{
        const match = bcrypt.compareSync(password, userExist.password);
        if(match){
            done(null, userExist)
        }else{
            const error = {
                url: req.originalUrl,
                method: req.method,
                status: 403,
                error: `Wrong password`
            };
            loggerConsole.error(error);
            loggerError.error(error)
            return done(null, false)
        };
    };
}));

//-- REGISTER
passport.use('local-register', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    let data = await usersApi.getAll();
    let user = data.find(i => i.email == email);
    if(user){
        const error = {
            url: req.originalUrl,
            method: req.method,
            error: `Usuario ya existe`
        };
        loggerConsole.warn(error);
        loggerWarn.warn(error)
        return done(null, false);
    };
    let newUser = {
        email: email,
        password: bcrypt.hashSync(password, 10),
        name: req.body.name,
        age: req.body.age,
        adress: req.body.adress,
        phone: req.body.cod + req.body.phone,
        img: req.file.originalname
    };
    await usersApi.create(newUser);
    await transporter.sendMail(newRgisterMail(newUser))
    done(null, newUser)
}));

//-- SERIALIZE / DESERIALIZE
passport.serializeUser((user, done) => {
    done(null, user);
  });
passport.deserializeUser(  (user, done) => {
      done(null, user)
  })



//---------------------------------- RUTAS --------------------------------------//

//---- REGISTRO

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', upload.single('img'), passport.authenticate('local-register', {
    successRedirect: '/user-home',
    failureRedirect: '/registererror'
}))


router.get('/registererror', (req, res) => {
    res.render('registererror')
})

//--- LOGIN

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/user-home',
    failureRedirect: '/loginerror'
}))

router.get('/loginerror', (req, res) => {
    res.render('loginerror')
})

//--- LOGOUT

router.get('/logout', (req, res) => {
    let name = req.session.passport.user.name
    req.logOut()
    req.session.destroy((err) =>{
        if(err){
            console.log(err)
        }
        res.clearCookie('connect.sid');
        res.render('logout', {name: name})
    })
})

//--- USERS HOME

router.get('/user-home', auth, (req, res) => {
    res.render('homeuser', {user: req.session.passport.user})
})



export { router, auth }