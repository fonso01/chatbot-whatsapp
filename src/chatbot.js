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
    ESPERANDO_FRECUENCIA: "ESPERANDO_FRECUENCIA",
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

function parsearPlazo(texto, frecuencia = "mensual") {
    if (!texto) return null;
    if (texto.includes("-")) return null;

    const textoMin = texto.toLowerCase();
    const match = textoMin.match(/\d+/);
    if (!match) return null;
    const num = parseInt(match[0], 10);
    if (isNaN(num) || num <= 0) return null;

    if (frecuencia === "semanal") {
        // Si el usuario especificó meses (ej: "3 meses")
        if (textoMin.includes("mes") && !textoMin.includes("semana")) {
            return num * 4;
        }
        // Si especificó semanas o eligió botón (ej: "12 semanas", plazo_12_semanas)
        return num >= 2 && num <= 120 ? num : null;
    }

    if (frecuencia === "quincenal") {
        // Si el usuario especificó meses (ej: "3 meses", "6 meses")
        if (textoMin.includes("mes") && !textoMin.includes("quincena")) {
            return num * 2;
        }
        // Si especificó quincenas o eligió botón (ej: "12 quincenas", plazo_12_quincenas)
        return num >= 2 && num <= 120 ? num : null;
    }

    // Por defecto mensual
    return num >= 1 && num <= 120 ? num : null;
}

function calcularCuota(monto, numeroCuotas, tasaAnual = 0.18, frecuencia = "mensual") {
    let periodosPorAno = 12;
    if (frecuencia === "quincenal") periodosPorAno = 24;
    if (frecuencia === "semanal") periodosPorAno = 48;

    const tasaPeriodo = tasaAnual / periodosPorAno;
    if (tasaPeriodo === 0) return Math.round(monto / numeroCuotas);
    const factor = Math.pow(1 + tasaPeriodo, numeroCuotas);
    const cuota = monto * (tasaPeriodo * factor) / (factor - 1);
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

        actualizarSesion(usuarioId, PASOS.ESPERANDO_FRECUENCIA, { monto: monto });

        return {
            texto: `💰 Monto registrado: ${formatearMoneda(monto)}\n\n¿Con qué frecuencia deseas realizar tus pagos?`,
            opciones: respuestas.cotizar_frecuencia.opciones
        };
    }

    // PASO 3: ESPERANDO FRECUENCIA DE PAGO
    if (sesion.paso === PASOS.ESPERANDO_FRECUENCIA) {
        let frecuencia = null;
        let plantillaPlazo = null;

        if (texto === "frecuencia_semanal" || texto.includes("semanal") || texto.includes("semana") || texto === "1") {
            frecuencia = "semanal";
            plantillaPlazo = respuestas.cotizar_plazo_semanal;
        } else if (texto === "frecuencia_quincenal" || texto.includes("quincenal") || texto.includes("quincena") || texto === "2") {
            frecuencia = "quincenal";
            plantillaPlazo = respuestas.cotizar_plazo_quincenal;
        } else if (texto === "frecuencia_mensual" || texto.includes("mensual") || texto.includes("mes") || texto === "3") {
            frecuencia = "mensual";
            plantillaPlazo = respuestas.cotizar_plazo_mensual;
        }

        if (frecuencia && plantillaPlazo) {
            actualizarSesion(usuarioId, PASOS.ESPERANDO_PLAZO, { frecuencia: frecuencia });
            return plantillaPlazo;
        }

        return {
            texto: "⚠️ Por favor, selecciona una frecuencia de pago disponible:\n\n¿Con qué frecuencia deseas realizar tus pagos?",
            opciones: respuestas.cotizar_frecuencia.opciones
        };
    }

    // PASO 4: ESPERANDO PLAZO
    if (sesion.paso === PASOS.ESPERANDO_PLAZO) {
        const frecuencia = sesion.datos.frecuencia || "mensual";
        const cuotas = parsearPlazo(texto, frecuencia);

        if (!cuotas) {
            let plantilla = respuestas.cotizar_plazo_mensual;
            if (frecuencia === "semanal") plantilla = respuestas.cotizar_plazo_semanal;
            if (frecuencia === "quincenal") plantilla = respuestas.cotizar_plazo_quincenal;

            return {
                texto: "⚠️ Por favor, ingresa o selecciona un plazo válido.\n\n" + plantilla.texto,
                opciones: plantilla.opciones
            };
        }

        const monto = sesion.datos.monto;
        const tipo = sesion.datos.tipoPrestamo || "Préstamo personal";
        const tasaAnual = sesion.datos.tasaAnual || 0.18;
        const cuota = calcularCuota(monto, cuotas, tasaAnual, frecuencia);
        const totalPagar = cuota * cuotas;

        let descripcionPlazo = `${cuotas} meses`;
        let etiquetaFrecuencia = "mensual";
        let periodoTexto = "/ mes";

        if (frecuencia === "semanal") {
            descripcionPlazo = `${cuotas} semanas (${Math.round(cuotas / 4)} meses aprox.)`;
            etiquetaFrecuencia = "semanal";
            periodoTexto = "/ semana";
        } else if (frecuencia === "quincenal") {
            descripcionPlazo = `${cuotas} quincenas (${Math.round(cuotas / 2)} meses)`;
            etiquetaFrecuencia = "quincenal";
            periodoTexto = "/ quincena";
        }

        actualizarSesion(usuarioId, PASOS.COTIZACION_COMPLETADA, {
            cuotas: cuotas,
            cuota: cuota,
            totalPagar: totalPagar
        });

        return {
            texto: `Perfecto. Tu cuota aproximada sería de ${formatearMoneda(cuota)} ${etiquetaFrecuencia}.\n\n📋 *Detalles de tu cotización:*\n• 👤 Tipo: ${tipo}\n• 💰 Monto solicitado: ${formatearMoneda(monto)}\n• 🗓️ Frecuencia de pago: ${etiquetaFrecuencia.charAt(0).toUpperCase() + etiquetaFrecuencia.slice(1)}\n• 📅 Plazo: ${descripcionPlazo}\n• 💵 Cuota estimada: ${formatearMoneda(cuota)} ${periodoTexto}\n• 📊 Total aproximado a pagar: ${formatearMoneda(totalPagar)}\n\n¿Qué deseas hacer ahora?`,
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