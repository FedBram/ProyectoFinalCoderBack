import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from "../config.js";
import timeStamp from "../timeStamp.js";


class ContenedorFs {
  constructor(route) {
    this.route = `${config.fs.path}/${route}`;
  }  

  ///------- LISTAR TODOS -------///
  async getAll() {
    try {
      let data = await fs.readFile(this.route, "utf-8");
      let parsedData = JSON.parse(data);
      return parsedData;
    }
    catch (err) {
      console.log('Ha ocurrido un error',err)
    }
  }

  ///------- CREAR UN NUEVO OBJETO -----------///
  async create(obj) {
    try {
      let fileExits = await this.getAll();
      if (fileExits && fileExits.length >= 0) {
        fileExits.push({...obj, id: uuidv4()});
        fs.writeFile(this.route, JSON.stringify(fileExits, null, 2), "utf-8");
      } else {
        fileExits.push({...obj, id: uuidv4()});
        fs.writeFile(this.route, JSON.stringify(fileExits, null, 2), "utf-8");
      }
    }
    catch (err) {
      console.log('Ha ocurrido un error',err)
    }
  }

  //------ MODIFICAR ELEMENTO POR ID --------------//
  async saveById(product, id) {
    try {
      await this.deleteById(id)
      let items = await this.getAll();
      items.push({...product, id: id});
      await fs.writeFile(this.route, JSON.stringify(items, null, 2), "utf-8");
    }
    catch (err) {
      console.log('Ha ocurrido un error',err)
    }
  }

  ///-------- BUSCAR PRODUCTO POR ID ---------///
  async getById(id) {
    try {
      let data = await fs.readFile(this.route, "utf-8");
      let parsedData = JSON.parse(data);
      let dataId = parsedData.find(e => e.id == id);
      return dataId;
    }
    catch (err) {
      console.log('Ha ocurrido un error',err)
    }
  }

  ///----- ELMINAR OBJETO POR ID -----///
  async deleteById(id) {
    try {
      let data = await fs.readFile(this.route, "utf-8");
      let parsedData = JSON.parse(data);
      let deletedItem = parsedData.filter(e => e.id != id);
      await fs.writeFile(this.route, JSON.stringify(deletedItem, null, 2), "utf-8");
    }
    catch (err) {
      console.log('Ha ocurrido un error',err)
    }
  }

  ///---- ELIMINAR TODOS LOS PRODUCTOS ---///
  async deleteAll() {
    try {
      await fs.writeFile(this.route,"[]");
    }
    catch (err) {
      console.log('Ha ocurrido un error',err);
    }
  }

  //--- Agregar producto al carrito
  async addToCart(item, id){
    try{
      let carrito = await this.getAll()
      carrito.forEach( (e) => {
        if(e.id == id){
          e.productos.push({...item, tiemStamp: timeStamp})
        }                
      });
      await fs.writeFile(this.route, JSON.stringify(carrito, null, 2), "utf-8")
    }
    catch(err) {
      console.log("Ha ocurrido un error", err)
    }
  }

  //-- Eliminar producto de carrito

  async deleteProdCart (item, id) {
    try{
      let carrito = await this.getAll()
      carrito.forEach((e) => {
          if(e.id == id){
              e.productos = e.productos.filter(i => i.id != item.id)
          }
      })
      await fs.writeFile(this.route, JSON.stringify(carrito, null, 2), "utf-8")
    }
    catch(err){
      console.log("Ha ocurrido un error", err)
    }
  }
}


export default ContenedorFs
