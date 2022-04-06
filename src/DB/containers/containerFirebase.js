import admin from "firebase-admin"
import config from '../config.js'
import { v4 as uuidv4 } from 'uuid';
import timeStamp from "../../util/timeStamp.js";

admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore();

class ContainerFirebase {
    constructor(collection){
        this.collection = db.collection(collection)
    }

     ///------- LISTAR TODOS -------///
     async getAll() {
        try {
            const response = []
            const querySnapshot = await this.collection.get()
            querySnapshot.forEach((e) => {
                response.push({ id: e.id, ...e.data()});
            })
            return response
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    ///------- CREAR UN NUEVO OBJETO -----------///
    async create(obj) {
        try {
            let doc = this.collection.doc(uuidv4())
            await doc.create(obj)
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    ///-------- BUSCAR PRODUCTO POR ID ---------///
    async getById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            const data = doc.data();
            return {...data, id}
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    //------ MODIFICAR ELEMENTO POR ID --------------//
    async saveById(product, id) {
        try {
            await this.collection.doc(id).update(product)
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    ///----- ELMINAR OBJETO POR ID -----///
    async deleteById(id) {
        try {
            await this.collection.doc(id).delete()
        }
        catch (err) {
        console.log('Ha ocurrido un error',err)
        }
    }

    //--- Agregar producto al carrito
    async addToCart(item, id){
        try{
            let carrito = await this.getById(id)
            carrito.productos.push({...item, timeStamp: timeStamp});
            await this.collection.doc(id).update(carrito)
        }
        catch(err) {
        console.log("Ha ocurrido un error", err)
        }
    }

    //-- Eliminar producto de carrito

    async deleteProdCart (item, id) {
        try{
            let carrito = await this.getById(id);
            carrito.productos = carrito.productos.filter(i => i.id != item.id);
            await this.collection.doc(id).update(carrito)
        }
        catch(err){
        console.log("Ha ocurrido un error", err)
        }
    }
}

export default ContainerFirebase