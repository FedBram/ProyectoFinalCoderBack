import {
    loggerConsole as loggerConsole,
    loggerError as loggerError
} from '../util/logger.js'


const authAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.session.passport.user.email === 'admin@admin.com'){
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

export default authAdmin