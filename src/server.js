const express = require("express");
const path = require("path");

const { procesarMensaje } = require("./chatbot");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(
    path.join(__dirname, "../public")
));

app.post("/mensaje", (req, res) => {

    const mensaje = req.body.mensaje;

    const respuesta = procesarMensaje(mensaje);

    res.json(respuesta);
});

app.listen(PORT, () => {

    console.log(
        `🤖 Chatbot ejecutándose en http://localhost:${PORT}`
    );

});