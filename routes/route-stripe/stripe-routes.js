const multer = require("multer");
const express = require("express");
const routes = express.Router();
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51KgLu3KRoIgYv8flYv6QCdVhfk7TnEEdbeNds83YTqAktYJ0L0YKeMtVGW1wM3paIg2OF5sY4VI5hlutCON8dlbN00MNBqn8wY");
const uploadImage = multer({
    storage: multer.memoryStorage(),
});
const conexion = require("../../database");
const storageBaseUrl = 'https://cs710032000dda411cc.blob.core.windows.net/pizza-planeta/';
const axios = require('axios');

let dataCompra;
routes.post("/", uploadImage.none("image"), async (req, res) => {
    console.log("body--->", req.body);
    dataCompra = req.body;

 conexion.query("SELECT * FROM user WHERE id_users = ?", [req.body.id_user], async(err, row) => {
        if (err) {
          return res.send({ err: 'Error en la base de datos' });
        }
    
        console.log('user->', row[0])
        user = row[0];

            // Agrupar productos por nombre y calcular precio total
    const groupedProducts = req.body.products.reduce((acc, item) => {
        const existingProduct = acc.find((p) => p.product_name === item.product_name);

        if (existingProduct) {
            existingProduct.quantity += item.quantity;
        } else {
            acc.push({ ...item });
        }

        return acc;
    }, []);

    // Calcular precio total sin envío
    const subtotal = groupedProducts.reduce((total, item) => total + (item.product_price * item.quantity), 0);

    // Agregar línea de envío
    const shippingCost = 10; // Costo de envío por toda la compra
    const totalAmount = subtotal + shippingCost;

    // Convertir a formato line_items de Stripe
    const line_items = [
        ...groupedProducts.map((item) => {
            console.log('URL IMAGE--->' , storageBaseUrl + item.image)
            return {
                price_data: {
                    currency: "MXN",
                    product_data: {
                        name: item.product_name,
                        images: ['https://cs710032000dda411cc.blob.core.windows.net/pizza-planeta/image_1700089010320.jpg?sv=2022-11-02&ss=bqtf&srt=sco&sp=rwdlacuptfxiy&se=2023-11-18T04:13:23Z&sig=219a28g6bjk5CJxeOzNXs7Jwaf0xULK6r2v4UlwXPR8%3D&_=1700267443154'],
                    },
                    unit_amount: item.product_price * 100 / item.quantity,
                },
                quantity: item.quantity,
            };
        }),
        {
            price_data: {
                currency: "MXN",
                product_data: {
                    name: "Costo de envío",
                },
                unit_amount: shippingCost * 100,
            },
            quantity: 1,
        },
    ];

    console.log("items--->", line_items);
    line_items.map(data=>{
        console.log('data product', data.price_data.product_data);
    })
     
    const session = await stripe.checkout.sessions.create({
        line_items,
        customer_email: user.user_email,
        mode: 'payment',
        success_url: 'http://localhost:5000/stripe/finalize',
        cancel_url: 'http://localhost:3000/checkout',
    });

    console.log(session.url);
    res.send(session.url);
    
      });


});

routes.get('/finalize', uploadImage.none("image"), async(req, res)=>{
    console.log('inicio peticion');
axios.post('http://localhost:5000/compras/add', dataCompra).then((result) => {
    res.redirect("http://localhost:3000/compras/usuario/" + dataCompra.id_user);
}).catch((err) => {
    console.log(err);
});

})

module.exports = routes;
