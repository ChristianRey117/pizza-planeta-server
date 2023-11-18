const nodemailer = require('nodemailer');
require('dotenv').config();

const sendConfirmationEmail = async (userEmail, usuario) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "pizzaplanetacompany@gmail.com",
            pass: "pypb catu gdwv txyw"
        }
    });

    const estructuraCorreo = {
        from: "Pizza Planeta <pizzaplanetacompany@gmail.com>",
        to: userEmail,
        subject: '¡Bienvenid@ Austronauta!',
        text: 'Gracias por registrarte a Pizza Planeta. Tu cuenta ha sido creada exitosamente.',
        html: BienvenidaHTML(usuario)
    };

    try {
        await transporter.sendMail(estructuraCorreo);
        return true; // Éxito al enviar el correo
    } catch (error) {
        console.error("Error al enviar el correo de confirmación:", error);
        return false; // Error al enviar el correo
    }
};


const BienvenidaHTML = (nombre) => {
    return `

    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Bienvenid@ a Pizza Planeta</title>
    <style>
        a {
            background-color: #FFD700;
            color: #000;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block; /* Importante para algunos clientes de correo */
        }

        a:hover {
            background-color: #FF8C00;
            color: #FFF;
        }
    </style>
</head>

<body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; border: 1px solid #fff; padding: 20px;">
        <tr>
            <td style="text-align: center; padding-top: 20px;">
                <h1 style="color: #FF0000;">¡Bienvenid@ a Pizza Planeta!</h1>
                <h2>${nombre}</h2>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 20px;">
                <p>Gracias por unirte a nuestra galáctica familia de amantes de la pizza. En Pizza Planeta, explorarás las delicias de las estrellas con nuestras pizzas únicas y sabores cósmicos.</p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding-top: 20px;">
                <a href="https://www.google.com" style="background-color: #FFD700; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">¡Explora Nuestro Universo de Sabores!</a>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 20px;">
                <p>¡Esperamos verte pronto y que disfrutes de nuestros increíbles sabores intergalácticos! 🍕🌌🚀</p>
            </td>
        </tr>
    </table>
</body>

</html>

    
    `;
} 


const sendCompraEmail = async (correoUsuario) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "pizzaplanetacompany@gmail.com",
            pass: "pypb catu gdwv txyw"
        }
    });

    const estructuraCorreoCompra = {
        from: "Pizza Planeta <pizzaplanetacompany@gmail.com>",
        to: correoUsuario,
        subject: 'Se ha registrado una compra',
        text: 'Gracias por comprar en Pizza Planeta.',
        html: avisoCompraHTML()
    };

    try {
        await transporter.sendMail(estructuraCorreoCompra);
        return true; // Éxito al enviar el correo
    } catch (error) {
        console.error("Error al enviar el correo de confirmación:", error);
        return false; // Error al enviar el correo
    }
};


const avisoCompraHTML = () => {
    return `

    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Purchase Confirmation - YourStore</title>
    <style>
        a {
            background-color: #3498db;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }

        a:hover {
            background-color: #2980b9;
        }
    </style>
</head>

<body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; border: 1px solid #fff; padding: 20px;">
        <tr>
            <td style="text-align: center; padding-top: 20px;">
                <h1 style="color: #FF0000;">¡Gracias por su compra en Pizza Planeta!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 20px;">
                <p>Gracias por comprar con nosotros. Su pedido está confirmado y estará en camino pronto.</p>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 20px;">
                <p>Estamos ansiosos por verte nuevamente y brindarte más productos increíbles!  🍕🌌🚀 </p>
            </td>
        </tr>
    </table>
</body>

</html>

    
    `;
} 


module.exports = { sendConfirmationEmail, sendCompraEmail };