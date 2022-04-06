//--------- USUARIOS -----------//
Hay un usuario ADMIN creado que permite utilizar las rutas con CRUD para productos:
email: admin@admin.com
password: Admin

//---------- RUTAS PRODUCTOS --------- //

GET "/productos": Muestra todos los productos a cualquier usuario logueado.
//---- SOLO ADMIN
GET "/productos/admin": Muestra todos los productos.
POST "/productos/admin": Agrega un producto.

ESQUEMA PARA PRODUCTO
  {
    "title": "",
    "artist": "",
    "price": ,
    "img": "",
    "Stock": 
  }


PUT "/productos/admin/:id": Modifica producto.
DELETE "/productos/admin/:id": Elimina producto

//-------- RUTAS CARRITO ------------//
Para usuarios registrado y logueados

POST "/carrito": Crea un carrito.
DELETE "/carrito/:id": Elimina un carrito.
POST "/carrito/:id/productos/:id_prod": Agrega un producto al carrito.
GET "/carrito/:id": Muestra los productos en un carrito.
DELETE "/carrito/:id/productos/:id_prod": Elimina un producto del carrito.
POST "/carrito//buy/:id": Finaliza la compra.
