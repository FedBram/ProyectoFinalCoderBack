import { productsDao as productosApi } from '../DB/daos/index.js'

const getAllProducts = async () => {
    try{
        let data = await productosApi.getAll()
        return data
    }catch(error){
        console.log(error)
    }
}

const createProduct = async (obj) => {
    try{
        await productosApi.create(obj)
    }catch(error){
        console.log(error)
    }
}

const getProductById = async (id) => {
    try{
        let data = await productosApi.getById(id);
        return data
    }catch(error){
        console.log(error)
    }
}

const modifyProduct = async (obj, id) => {
    try{
        await productosApi.saveById(obj, id)
    }catch(error){
        console.log(error)
    }
}

const eraseProduct = async (id) => {
    try{
        await productosApi.deleteById(id)
    }catch(error){
        console.log(error)
    }
}

export { getAllProducts, getProductById, createProduct, modifyProduct, eraseProduct }