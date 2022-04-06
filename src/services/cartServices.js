import { cartsDao as cartsApi } from './../DB/daos/index.js';


const createCart = async (obj) => {
    try{
        await cartsApi.create(obj)    
    }catch(error){
        console.log(error)
    }
}


const eraseCart = async (id) => {
    try{
        await cartsApi.deleteById(id)
    }catch(error){
        console.log(error)
    }
}

const addProdToCart = async (obj, id) => {
    try{
        await cartsApi.addToCart(obj, id)
    }catch(error){
        console.log(error)
    }
}

const getAllCarts = async () => {
    try{
        let data = await cartsApi.getAll();
        return data
    }catch(error){
        console.log(error)
    }
}

const eraseProdCart = async (obj, id) => {
    try{
        await cartsApi.deleteProdCart(obj, id)
    }catch(error){
        console.log(error)
    }
}

export { createCart, eraseCart, addProdToCart, getAllCarts, eraseProdCart, }