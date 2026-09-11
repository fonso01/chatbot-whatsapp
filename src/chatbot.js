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

// ==========================================
// CONSTANTES DE PASOS DE CONVERSACIÓN
// ==========================================

const PASOS = {
    INICIO: "INICIO",
    ESPERANDO_TIPO: "ESPERANDO_TIPO",
    ESPERANDO_MONTO: "ESPERANDO_MONTO",
    ESPERANDO_PLAZO: "ESPERANDO_PLAZO",
    COTIZACION_COMPLETADA: "COTIZACION_COMPLETADA"
};

// ==========================================
// FUNCIONES AUXILIARES DE PARSEO Y CÁLCULO
// ==========================================

function formatearMoneda(cantidad) {
    if (typeof cantidad !== "number" || isNaN(cantidad)) return "RD$0";
    return "RD$" + Math.round(cantidad).toLocaleString("en-US");
}

function parsearMonto(texto) {
    if (!texto) return null;
    if (texto.includes("-")) return null;
    const limpio = texto.replace(/[^\d]/g, "");
    if (!limpio) return null;
    const monto = parseInt(limpio, 10);
    return isNaN(monto) || monto <= 0 ? null : monto;
}

function parsearPlazo(texto) {
    if (!texto) return null;
    if (texto.includes("-")) return null;
    const match = texto.match(/\d+/);
    if (!match) return null;
    const plazo = parseInt(match[0], 10);
    return isNaN(plazo) || plazo < 1 || plazo > 120 ? null : plazo;
}

function calcularCuota(monto, plazoMeses, tasaAnual = 0.18) {
    const tasaMensual = tasaAnual / 12;
    if (tasaMensual === 0) return Math.round(monto / plazoMeses);
    const factor = Math.pow(1 + tasaMensual, plazoMeses);
    const cuota = monto * (tasaMensual * factor) / (factor - 1);
    return Math.round(cuota);
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

    // ==========================================
    // FLUJO CONVERSACIONAL (MÁQUINA DE ESTADOS)
    // ==========================================

    // PASO 1: ESPERANDO TIPO DE PRÉSTAMO
    if (sesion.paso === PASOS.ESPERANDO_TIPO) {
        let tipo = null;
        let tasaAnual = 0.18;

        if (texto === "cotizar_personal" || texto.includes("personal") || texto === "1") {
            tipo = "Préstamo personal";
            tasaAnual = 0.18;
        } else if (texto === "cotizar_negocio" || texto.includes("negocio") || texto === "2") {
            tipo = "Préstamo para negocio";
            tasaAnual = 0.16;
        } else if (texto === "cotizar_emergencia" || texto.includes("emergencia") || texto === "3") {
            tipo = "Préstamo de emergencia";
            tasaAnual = 0.20;
        }

        if (tipo) {
            actualizarSesion(usuarioId, PASOS.ESPERANDO_MONTO, {
                tipoPrestamo: tipo,
                tasaAnual: tasaAnual
            });
            return {
                texto: `¿Cuánto dinero necesitas?\n\n(Ejemplo: RD$50,000 o escribe 50000)`,
                opciones: [
                    { texto: "❌ Cancelar", valor: "cancelar" }
                ]
            };
        }

        return respuestas.tipos_prestamos;
    }

    // PASO 2: ESPERANDO MONTO
    if (sesion.paso === PASOS.ESPERANDO_MONTO) {
        const monto = parsearMonto(texto);

        if (!monto || monto < 1000) {
            return {
                texto: "⚠️ Por favor, ingresa un monto numérico válido.\n\n¿Cuánto dinero necesitas?\n(Ejemplo: RD$50,000 o escribe 50000)",
                opciones: [
                    { texto: "❌ Cancelar", valor: "cancelar" }
                ]
            };
        }

        actualizarSesion(usuarioId, PASOS.ESPERANDO_PLAZO, { monto: monto });

        return {
            texto: `¿En cuánto tiempo deseas pagarlo?\n\nPuedes elegir una opción o escribir los meses (ejemplo: 12 meses):`,
            opciones: respuestas.cotizar_plazo.opciones
        };
    }

    // PASO 3: ESPERANDO PLAZO
    if (sesion.paso === PASOS.ESPERANDO_PLAZO) {
        const plazo = parsearPlazo(texto);

        if (!plazo || plazo < 1 || plazo > 60) {
            return {
                texto: "⚠️ Por favor, ingresa un plazo válido entre 1 y 60 meses.\n\n¿En cuánto tiempo deseas pagarlo?",
                opciones: respuestas.cotizar_plazo.opciones
            };
        }

        const monto = sesion.datos.monto;
        const tipo = sesion.datos.tipoPrestamo || "Préstamo personal";
        const tasaAnual = sesion.datos.tasaAnual || 0.18;
        const cuota = calcularCuota(monto, plazo, tasaAnual);
        const totalPagar = cuota * plazo;

        actualizarSesion(usuarioId, PASOS.COTIZACION_COMPLETADA, {
            plazo: plazo,
            cuota: cuota,
            totalPagar: totalPagar
        });

        return {
            texto: `Perfecto. Tu cuota aproximada sería de ${formatearMoneda(cuota)}.\n\n📋 *Detalles de tu cotización:*\n• 👤 Tipo: ${tipo}\n• 💰 Monto solicitado: ${formatearMoneda(monto)}\n• 📅 Plazo: ${plazo} meses\n• 💵 Cuota mensual estimada: ${formatearMoneda(cuota)}\n• 📊 Total aproximado a pagar: ${formatearMoneda(totalPagar)}\n\n¿Qué deseas hacer ahora?`,
            opciones: [
                {
                    texto: "🔄 Cotizar otro préstamo",
                    valor: "tipos_prestamos"
                },
                {
                    texto: "📞 Contactar asesor",
                    valor: "contacto"
                },
                {
                    texto: "🏠 Menú principal",
                    valor: "menu"
                }
            ]
        };
    }

    // Si completó la cotización y envía otro mensaje, reiniciamos el paso
    if (sesion.paso === PASOS.COTIZACION_COMPLETADA) {
        reiniciarSesion(usuarioId);
    }

    // ==========================================
    // DISPARADORES: TIPOS DE PRÉSTAMOS / COTIZACIÓN
    // ==========================================

    if (
        texto === "tipos_prestamos" ||
        texto === "iniciar_cotizacion" ||
        texto === "cotizar" ||
        texto === "cotizar prestamo" ||
        texto === "cotizar préstamo" ||
        texto === "solicitar" ||
        texto === "solicitar prestamo" ||
        texto === "solicitar préstamo" ||
        texto === "quiero solicitar" ||
        texto === "calcular cuota" ||
        texto === "cuota" ||
        texto.includes("tipos de prestamo") ||
        texto.includes("tipos de préstamo") ||
        texto.includes("tipo de prestamo") ||
        texto.includes("tipo de préstamo") ||
        texto.includes("tipos prestamo") ||
        texto.includes("tipos préstamo") ||
        texto === "prestamos" ||
        texto === "préstamos"
    ) {
        actualizarSesion(usuarioId, PASOS.ESPERANDO_TIPO);
        return respuestas.tipos_prestamos;
    }

    if (texto === "cotizar_personal") {
        actualizarSesion(usuarioId, PASOS.ESPERANDO_MONTO, {
            tipoPrestamo: "Préstamo personal",
            tasaAnual: 0.18
        });
        return {
            texto: `👤 Has seleccionado Préstamo personal.\n\n¿Cuánto dinero necesitas?\n\n(Ejemplo: RD$50,000 o escribe 50000)`,
            opciones: [
                { texto: "❌ Cancelar", valor: "cancelar" }
            ]
        };
    }

    if (texto === "cotizar_negocio") {
        actualizarSesion(usuarioId, PASOS.ESPERANDO_MONTO, {
            tipoPrestamo: "Préstamo para negocio",
            tasaAnual: 0.16
        });
        return {
            texto: `🏪 Has seleccionado Préstamo para negocio.\n\n¿Cuánto dinero necesitas?\n\n(Ejemplo: RD$50,000 o escribe 50000)`,
            opciones: [
                { texto: "❌ Cancelar", valor: "cancelar" }
            ]
        };
    }

    if (texto === "cotizar_emergencia") {
        actualizarSesion(usuarioId, PASOS.ESPERANDO_MONTO, {
            tipoPrestamo: "Préstamo de emergencia",
            tasaAnual: 0.20
        });
        return {
            texto: `🚨 Has seleccionado Préstamo de emergencia.\n\n¿Cuánto dinero necesitas?\n\n(Ejemplo: RD$15,000 o escribe 15000)`,
            opciones: [
                { texto: "❌ Cancelar", valor: "cancelar" }
            ]
        };
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
    reiniciarSesion,
    PASOS,
    parsearMonto,
    parsearPlazo,
    calcularCuota,
    formatearMoneda
};