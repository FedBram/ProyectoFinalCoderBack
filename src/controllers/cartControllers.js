import { createCart, eraseCart, addProdToCart, getAllCarts, eraseProdCart } from './../services/cartServices.js'
import { getAllProducts, getProductById } from './../services/productosServices.js'

//--- IMPRESOR DE FECHA Y HORA
import timeStamp from "../util/timeStamp.js";
//--- NODEMAILER
import {
    transporter as transporter,
    newBuyMail as newBuyMail
} from './../configs/mailconfig.js';
//--- TWILIO
import client from './../configs/twilioconfig.js'

const postCart = async (req, res) => {
    try{
        await createCart({timeStamp: timeStamp, productos: []});
        res.send("Carrito creado")
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const deleteCart = async (req, res) => {
    try{
        await eraseCart(req.params.id)
        res.send('Carrito eliminado')
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const addCartProd = async (req, res) => {
    try{
        let producto = await getProductById(req.params.id_prod)
        if(producto != null){
            await addProdToCart(producto, req.params.id)
            res.send("Producto agregado al carrito")
        }else{
            res.send('El producto seleccionado no existe')
        }
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        // res.send(err)
        console.log(err)
    }
}

const getCart = async (req, res) => {
    try{
        let data = await getAllCarts();
        let products = [];
        data.forEach((i) => {
            if(i.id == req.params.id){
                i.productos.forEach((e) => {
                    products.push(e)
                })
            }
        })
        res.render('carrito', {data: products})
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const deleteCartProd = async (req, res) => {
    try{
        let producto = await getProductById(req.params.id_prod)
        if(producto != null){
            await eraseProdCart(producto, req.params.id)
            res.send('Producto Eliminado')
        }else{
            res.send('El producto seleccionado no existe')
        }
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const postBuy = async (req, res) => {
    try{
        let user = req.session.passport.user;
        let data = await getAllCarts();
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
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const all = async (req, res) => {
    let productos = await getAllProducts();
    let carritos = await getAllCarts();
    res.send({Productos: productos, Carritos: carritos});
}

export {postCart, deleteCart, addCartProd, getCart, deleteCartProd, postBuy, all }