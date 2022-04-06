import {usersDao as usersApi} from '../DB/daos/index.js';
import bcrypt from "bcryptjs";
import {
    loggerConsole as loggerConsole,
    loggerWarn as loggerWarn,
    loggerError as loggerError
} from '../util/logger.js'
//--- NODEMAILER
import {
    transporter as transporter,
    newRgisterMail as newRgisterMail
} from '../configs/mailconfig.js'


const fields = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}

const login = async (req, email, password, done) => {
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
}

const register = async (req, email, password, done) => {
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
    }else if(password !== req.body.passwordRev){
        const error = {
            url: req.originalUrl,
            method: req.method,
            error: `Las contraseñas ingresadas no coinciden`
        };
        loggerConsole.warn(error);
        loggerWarn.warn(error)
        return done(null, false);
    }else{
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
    }
}

export { fields, login, register }