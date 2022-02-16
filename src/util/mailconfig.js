import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth:{
        user: `${process.env.ADMIN_MAIL}`,
        pass: `${process.env.ADMIN_PASS}`
    }
})

const newRgisterMail = (user) => {
    const mail = {
        from: 'Servidor node.js',
        to: `${process.env.ADMIN_MAIL}`,
        subject: `Nuevo registro`,
        html:`  
            <h3>Datos del usuario</h3>
            <p>Nombre: ${user.name}</p>
            <p>Edad:  ${user.age}</p>
            <p>Direccion:  ${user.adress}</p>
            <p>Telefono:  ${user.phone}</p>
            <p>Email:  ${user.email}</p>
        `
    }
    return mail
}

const newBuyMail = (user, cart) => {
    let template = cart.map((i) => {
        return `
            <div>
            <p>Titulo: ${i.title}</p>
            <p>Artista:  ${i.artist}</p>
            <p>Precio: ${i.price}</p>
            </div>
        `
    })
    const mail = {
        from: 'Servidor node.js',
        to: `${process.env.ADMIN_MAIL}`,
        subject: `Nuevo pedido de ${user.name}, ${user.email}`,
        html: `${template}`
    }
    return mail
}

export { transporter, newRgisterMail, newBuyMail }