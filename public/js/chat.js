const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Identificador único del usuario (persiste en la sesión del navegador)
let usuarioId = localStorage.getItem("chat_usuario_id");
if (!usuarioId) {
    usuarioId = "user_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("chat_usuario_id", usuarioId);
}


// Enviar mensaje escrito
sendButton.addEventListener("click", () => {

    enviarMensaje();

});


// Enviar con Enter
input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        enviarMensaje();

    }

});


async function enviarMensaje() {

    const mensaje = input.value.trim();

    if (mensaje === "") {
        return;
    }

    agregarMensaje(mensaje, "user");

    input.value = "";

    await obtenerRespuesta(mensaje);

}


async function enviarOpcion(valor, texto) {

    agregarMensaje(texto, "user");

    await obtenerRespuesta(valor);

}


async function obtenerRespuesta(mensaje) {

    try {

        const response = await fetch("/mensaje", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mensaje: mensaje,
                usuarioId: usuarioId
            })

        });

        const data = await response.json();

        agregarMensaje(data.texto, "bot");

        agregarOpciones(data.opciones);

    } catch (error) {

        console.error(error);

        agregarMensaje(
            "No se pudo conectar con el servidor.",
            "bot"
        );

    }

}


function agregarMensaje(texto, tipo) {

    const mensaje = document.createElement("div");

    mensaje.classList.add("message", tipo);

    mensaje.innerHTML = texto.replace(/\n/g, "<br>");

    messages.appendChild(mensaje);

    messages.scrollTop = messages.scrollHeight;

}


function agregarOpciones(opciones) {

    if (!opciones || opciones.length === 0) {
        return;
    }

    const container = document.createElement("div");

    container.classList.add("options");

    opciones.forEach(opcion => {

        const button = document.createElement("button");

        button.classList.add("option-button");

        button.textContent = opcion.texto;

        button.addEventListener("click", () => {

            enviarOpcion(
                opcion.valor,
                opcion.texto
            );

        });

        container.appendChild(button);

    });

    messages.appendChild(container);

    messages.scrollTop = messages.scrollHeight;

}


// Mensaje inicial
obtenerRespuesta("hola");