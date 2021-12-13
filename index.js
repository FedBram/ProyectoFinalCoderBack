//------MODULOS

import express from 'express'
import { router as productRoutes} from "./routes/productos.js"
import {router as cartRoutes} from "./routes/cart.js"

//-----VARIABLES

const app = express();
const port = process.env.PORT || 8080;


//-----ROUTES

app.use("/api/productos", productRoutes);
app.use("/api/carrito", cartRoutes);


//-------//

app.use(express.json());
app.use(express.urlencoded({extended:false}));


//-------//

app.listen(port, () => {
    console.log(`Sever running on port ${port}`);
});