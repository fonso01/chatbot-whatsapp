const respuestas = require("./respuestas");

// ==========================================
// GESTIÓN DE SESIONES / ESTADOS POR USUARIO
// ==========================================

const sesiones = {};

function obtenerSesion(usuarioId) {
    if (!sesiones[usuarioId]) {
        sesiones[usuarioId] = {
            paso: "INICIO",
            datos: {},
            ultimaActualizacion: Date.now()
        };
    }
    return sesiones[usuarioId];
}

function actualizarSesion(usuarioId, nuevoPaso, nuevosDatos = {}) {
    const sesion = obtenerSesion(usuarioId);
    sesion.paso = nuevoPaso;
    sesion.datos = {
        ...sesion.datos,
        ...nuevosDatos
    };
    sesion.ultimaActualizacion = Date.now();
    return sesion;
}

function reiniciarSesion(usuarioId) {
    sesiones[usuarioId] = {
        paso: "INICIO",
        datos: {},
        ultimaActualizacion: Date.now()
    };
    return sesiones[usuarioId];
}

function procesarMensaje(mensaje, usuarioId = "default") {

    const texto = mensaje.toLowerCase().trim();
    const sesion = obtenerSesion(usuarioId);

    // ==========================================
    // COMANDOS GLOBALES / REINICIO DE SESIÓN
    // ==========================================

    if (
        texto.includes("hola") ||
        texto.includes("buenas") ||
        texto.includes("buenos dias") ||
        texto.includes("buenas tardes") ||
        texto.includes("buenas noches") ||
        texto === "inicio" ||
        texto === "menu" ||
        texto === "menú" ||
        texto === "cancelar" ||
        texto === "reiniciar"
    ) {
        reiniciarSesion(usuarioId);
        return respuestas.menu;
    }


    // =========================
    // PRÉSTAMO PERSONAL
    // =========================

    if (
        texto === "personal" ||
        texto.includes("prestamo personal") ||
        texto.includes("préstamo personal") ||
        texto.includes("prestamo para mi") ||
        texto.includes("préstamo para mi")
    ) {
        return respuestas.personal;
    }


    // =========================
    // PRÉSTAMO PARA NEGOCIO
    // =========================

    if (
        texto === "negocio" ||
        texto.includes("prestamo para negocio") ||
        texto.includes("préstamo para negocio") ||
        texto.includes("prestamo para mi negocio") ||
        texto.includes("préstamo para mi negocio") ||
        texto.includes("dinero para mi negocio") ||
        texto.includes("para mi negocio")
    ) {
        return respuestas.negocio;
    }


    // =========================
    // PRÉSTAMO DE EMERGENCIA
    // =========================

    if (
        texto === "emergencia" ||
        texto.includes("prestamo de emergencia") ||
        texto.includes("préstamo de emergencia") ||
        texto.includes("necesito dinero urgente") ||
        texto.includes("dinero urgente") ||
        texto.includes("emergencia")
    ) {
        return respuestas.emergencia;
    }


    // =========================
    // TIPOS DE PRÉSTAMOS
    // =========================

    if (
        texto === "tipos_prestamos" ||
        texto.includes("tipos de prestamo") ||
        texto.includes("tipos de préstamo") ||
        texto.includes("tipo de prestamo") ||
        texto.includes("tipo de préstamo") ||
        texto.includes("tipos prestamo") ||
        texto.includes("tipos préstamo") ||
        texto === "prestamos" ||
        texto === "préstamos" ||
        (
            (texto.includes("prestamo") || texto.includes("préstamo")) &&
            (
                texto.includes("tipo") ||
                texto.includes("tipos") ||
                texto.includes("quiero") ||
                texto.includes("solicitar") ||
                texto.includes("solicitud") ||
                texto.includes("pedir") ||
                texto.includes("necesito") ||
                texto.includes("informacion") ||
                texto.includes("información") ||
                texto.includes("ofrecen") ||
                texto.includes("ver")
            )
        )
    ) {
        return respuestas.tipos_prestamos;
    }


    // =========================
    // REQUISITOS
    // =========================

    if (
        texto === "requisitos" ||
        texto.includes("requisito") ||
        texto.includes("que necesito") ||
        texto.includes("qué necesito") ||
        texto.includes("que documentos") ||
        texto.includes("qué documentos") ||
        texto.includes("documentos necesito") ||
        texto.includes("como solicito") ||
        texto.includes("cómo solicito") ||
        texto.includes("que debo llevar") ||
        texto.includes("qué debo llevar")
    ) {
        return respuestas.requisitos;
    }


    // =========================
    // TASAS DE INTERÉS
    // =========================

    if (
        texto === "tasas" ||
        texto.includes("tasa") ||
        texto.includes("interes") ||
        texto.includes("interés") ||
        texto.includes("cuanto cobran") ||
        texto.includes("cuánto cobran") ||
        texto.includes("cuanto es el interes") ||
        texto.includes("cuánto es el interés")
    ) {
        return respuestas.tasas;
    }


    // =========================
    // PLAZOS DE PAGO
    // =========================

    if (
        texto === "plazos" ||
        texto.includes("plazo") ||
        texto.includes("cuanto tiempo") ||
        texto.includes("cuánto tiempo") ||
        texto.includes("cuando tengo que pagar") ||
        texto.includes("cuándo tengo que pagar") ||
        texto.includes("cada cuanto pago") ||
        texto.includes("cada cuánto pago") ||
        texto.includes("frecuencia de pago")
    ) {
        return respuestas.plazos;
    }


    // =========================
    // CUOTA
    // =========================

    if (
        texto === "cuota" ||
        texto.includes("cuota") ||
        texto.includes("cuanto pagaria") ||
        texto.includes("cuánto pagaría") ||
        texto.includes("cuanto voy a pagar") ||
        texto.includes("cuánto voy a pagar") ||
        texto.includes("calcular cuota") ||
        texto.includes("calcular la cuota")
    ) {
        return respuestas.cuota;
    }


    // =========================
    // CONTACTO
    // =========================

    if (
        texto === "contacto" ||
        texto.includes("contacto") ||
        texto.includes("contactar") ||
        texto.includes("asesor") ||
        texto.includes("representante") ||
        texto.includes("telefono") ||
        texto.includes("teléfono")
    ) {
        return respuestas.contacto;
    }


    // =========================
    // NO RECONOCIDO
    // =========================

    return respuestas.desconocido;
}

module.exports = {
    procesarMensaje,
    sesiones,
    obtenerSesion,
    actualizarSesion,
    reiniciarSesion
};