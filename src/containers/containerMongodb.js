import mongoose from 'mongoose';
import config from '../config.js';
import timeStamp from "../util/timeStamp.js";

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

class ContenedorMongodb{
  
    constructor(collection, schema){
        this.collection = mongoose.model(collection, schema)
    }

    ///------- LISTAR TODOS -------///
    async getAll() {
        try {
            let data = await this.collection.find()
            return data;
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    ///------- CREAR UN NUEVO OBJETO -----------///
    async create(obj) {
        try {
            await this.collection.create(obj)
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    ///-------- BUSCAR PRODUCTO POR ID ---------///
    async getById(id) {
        try {
            let obj = await this.collection.findOne({_id: id})
            return obj;
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    //------ MODIFICAR ELEMENTO POR ID --------------//
    async saveById(product, id) {
        try {
            await this.collection.findOneAndUpdate({_id: id}, product)
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    ///----- ELMINAR OBJETO POR ID -----///
    async deleteById(id) {
        try {
            await this.collection.findOneAndDelete({_id: id})
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    ///---- ELIMINAR TODOS LOS PRODUCTOS ---///
    async deleteAll() {
        try {
            await this.collection.deleteAll()
        }
        catch (err) {
        console.log('Ha ocurrido un error',err);
        }
    }

    //--- Agregar producto al carrito
    async addToCart(item, id){
        try{
            let carrito = await this.collection.findById(id);
            carrito.productos.push({...item, timeStamp: timeStamp})
            await this.collection.findOneAndUpdate({_id: id}, carrito)
        }
        catch(err) {
        console.log("Ha ocurrido un error", err)
        }
    }

    //-- Eliminar producto de carrito

    async deleteProdCart (item, id) {
        try{
            let carrito = await this.collection.findOne({_id: id});
            carrito.productos = carrito.productos.filter(i => i._id != item.id);
            await this.collection.findOneAndUpdate({_id: id}, carrito)
        }
        catch(err){
        console.log("Ha ocurrido un error", err)
        }
    }
}


export default ContenedorMongodb