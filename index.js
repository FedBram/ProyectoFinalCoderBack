//------------------------------ MODULOS ---------------------------------//

import express from 'express'

import { router as productRoutes} from "./routes/productos.js"
import {router as cartRoutes} from "./routes/cart.js";
import { router as usersRoutes } from './routes/auth.js';

import { engine } from 'express-handlebars';

import cluster from 'cluster';
import { cpus } from 'os';


//------------ IMPORTS -------------//

//--- LOGGERS
import {
    loggerConsole as loggerConsole,
    loggerWarn as loggerWarn,
    loggerError as loggerError
} from './src/util/logger.js'

import ParsedArgs from './processargv.js'


//------------------------------ VARIABLES ------------------------------//

const app = express();
const PORT = process.env.PORT || ParsedArgs.port;


//------------------------- MIDDLESWARES -------------------------------------------//


app.use(express.json());
app.use(express.urlencoded({extended:false}));


//------------------------- STATICS -------------------------------//

app.use(express.static('./public'))


//------------------------ CONFIG DE PLANTILLA -----------------------//

app.set("views", "./views")
app.set("view engine", "hbs")

app.engine(
    "hbs",
    engine({
        extname: "hbs",
        layoutsDir: './views/layouts',
        defaultLayout: "index",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    })
)


//-------------------------- ROUTER CONFIG --------------------//

//--- LOGS
app.use(function( req, res, next) {
    loggerConsole.info(`Ruta: ${req.originalUrl }, Method: ${req.method}`)
    return next()
})


//---------------- RUTAS ---------------//

app.use("/productos", productRoutes);
app.use("/carrito", cartRoutes);
app.use('/', usersRoutes)

app.get('/', (req, res) => {
    res.render('index')
})


//------ ERROR 404 HANDLIG & LOGGING ------//

app.use((req, res, next) => {
    const error = {
        url: req.originalUrl,
        method: req.method,
        status: 404,
        error: `Not found`
    }
    loggerConsole.warn(error);
    loggerWarn.warn(error)
    res.status(404).send(error)
})



//------ INICIO DEL SERVER CON CLUSTER ---------//////

if(ParsedArgs.mode == 'cluster' && cluster.isPrimary){
    for(let i = 0; i < cpus().length; i++){
        cluster.fork()
    }
    cluster.on('exit', () => {
        loggerConsole.info(`Process ${process.pid} terminated`)
    })
}else{
    app.listen(PORT, () => {
        loggerConsole.info(`Sever running on port ${PORT}`);
    });
}