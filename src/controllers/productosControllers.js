import { getAllProducts, getProductById, createProduct, modifyProduct, eraseProduct } from './../services/productosServices.js'

const getProducts = async (req, res) => {
    try{
        let data = await getAllProducts()
        res.render('productos', {data: data});
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const getProductsAdmin = async (req, res) => {
    try{
        let data = await getAllProducts()
        res.json({data: data});
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const postProduct = async (req, res) => {
    try{
        await createProduct(req.body)
        res.send('Producto creado')
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const getOneProduct = async (req, res) => {
    try{
        let productExist = await getProductById(req.params.id);
        if (productExist != null){
            res.send(productExist)
        }else {
            res.send({error: "Producto no encontrado"})
        }
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const putProduct = async (req, res) => {
    try{
        await modifyProduct(req.body, req.params.id)
        res.send("Producto modificado")
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const deleteProduct = async (req, res) => {
    try{
        await eraseProduct(req.params.id)
        res.send("Producto eliminado")        
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

export { getProducts, getOneProduct, postProduct, putProduct, deleteProduct, getProductsAdmin }