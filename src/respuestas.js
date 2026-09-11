const respuestas = {

    menu: {
        texto: "🏠 Bienvenido a nuestro servicio de préstamos.\n\n¿En qué información estás interesado?",
        opciones: [
            {
                texto: "🧮 Cotizar préstamo",
                valor: "iniciar_cotizacion"
            },
            {
                texto: "💰 Tipos de préstamos",
                valor: "tipos_prestamos"
            },
            {
                texto: "📋 Requisitos",
                valor: "requisitos"
            },
            {
                texto: "💵 Tasas de interés",
                valor: "tasas"
            },
            {
                texto: "📅 Plazos de pago",
                valor: "plazos"
            },
            {
                texto: "🧮 Ejemplo de cuota",
                valor: "cuota"
            },
            {
                texto: "📞 Contactar asesor",
                valor: "contacto"
            }
        ]
    },

    tipos_prestamos: {
        texto: "💰 Tipos de préstamos\n\nSelecciona el tipo de préstamo que deseas conocer:",
        opciones: [
            {
                texto: "👤 Préstamo personal",
                valor: "personal"
            },
            {
                texto: "🏪 Préstamo para negocio",
                valor: "negocio"
            },
            {
                texto: "🚨 Préstamo de emergencia",
                valor: "emergencia"
            },
            {
                texto: "🏠 Volver al menú",
                valor: "menu"
            }
        ]
    },

    personal: {
        texto: "👤 Préstamo personal\n\nPréstamos destinados a cubrir necesidades personales.\n\n💰 Monto: Desde RD$10,000\n📅 Plazo: Según evaluación\n💵 Tasa: Según condiciones del préstamo.",
        opciones: [
            {
                texto: "🧮 Cotizar este préstamo",
                valor: "cotizar_personal"
            },
            {
                texto: "⬅️ Volver a préstamos",
                valor: "tipos_prestamos"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    negocio: {
        texto: "🏪 Préstamo para negocio\n\nOrientado a pequeños negocios que necesitan capital para sus operaciones.\n\n💰 Monto: Desde RD$20,000\n📅 Plazo: Según evaluación\n💵 Tasa: Según condiciones del préstamo.",
        opciones: [
            {
                texto: "🧮 Cotizar este préstamo",
                valor: "cotizar_negocio"
            },
            {
                texto: "⬅️ Volver a préstamos",
                valor: "tipos_prestamos"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    emergencia: {
        texto: "🚨 Préstamo de emergencia\n\nDiseñado para cubrir necesidades económicas de corto plazo.\n\n💰 Monto: Según evaluación\n📅 Plazo: Corto plazo\n💵 Tasa: Según condiciones del préstamo.",
        opciones: [
            {
                texto: "🧮 Cotizar este préstamo",
                valor: "cotizar_emergencia"
            },
            {
                texto: "⬅️ Volver a préstamos",
                valor: "tipos_prestamos"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    requisitos: {
        texto: "📋 Requisitos generales\n\n• Ser mayor de edad\n• Presentar documento de identidad\n• Tener número de teléfono activo\n• Presentar información sobre sus ingresos\n• Proporcionar referencias personales\n\nLos requisitos pueden variar dependiendo del préstamo.",
        opciones: [
            {
                texto: "🧮 Cotizar préstamo",
                valor: "iniciar_cotizacion"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    tasas: {
        texto: "💵 Tasas de interés\n\nLa tasa de interés dependerá del monto solicitado y del plazo acordado.\n\nPara conocer la tasa correspondiente a un préstamo específico, puedes contactar a un asesor o usar nuestro cotizador.",
        opciones: [
            {
                texto: "🧮 Cotizar préstamo",
                valor: "iniciar_cotizacion"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    plazos: {
        texto: "📅 Plazos de pago\n\nLos préstamos pueden establecerse de acuerdo con diferentes frecuencias de pago:\n\n• Semanal\n• Quincenal\n• Mensual\n\nEl plazo dependerá de las condiciones acordadas para cada préstamo.",
        opciones: [
            {
                texto: "🧮 Cotizar préstamo",
                valor: "iniciar_cotizacion"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    cuota: {
        texto: "🧮 Ejemplo de cuota\n\nEjemplo:\n\n💰 Monto: RD$20,000\n💵 Interés: 10%\n📅 Plazo: 10 cuotas\n\nEl cálculo de la cuota dependerá del método de interés utilizado.\n\n¿Deseas calcular tu propia cuota personalizada?",
        opciones: [
            {
                texto: "🧮 Cotizar mi préstamo",
                valor: "iniciar_cotizacion"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    contacto: {
        texto: "📞 Contactar asesor\n\nSi necesitas información personalizada sobre un préstamo, puedes comunicarte con uno de nuestros asesores.\n\n📱 Teléfono: 000-000-0000\n📧 Correo: prestamos@empresa.com",
        opciones: [
            {
                texto: "🧮 Cotizar préstamo",
                valor: "iniciar_cotizacion"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    cotizar_tipo: {
        texto: "🧮 Cotizador de Préstamos\n\n¿Qué tipo de préstamo deseas?",
        opciones: [
            {
                texto: "👤 Préstamo personal",
                valor: "cotizar_personal"
            },
            {
                texto: "🏪 Préstamo para negocio",
                valor: "cotizar_negocio"
            },
            {
                texto: "🚨 Préstamo de emergencia",
                valor: "cotizar_emergencia"
            },
            {
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    cotizar_plazo: {
        texto: "¿En cuánto tiempo deseas pagarlo?\n\nPuedes elegir una opción o escribir los meses (ejemplo: 12 meses):",
        opciones: [
            {
                texto: "6 meses",
                valor: "plazo_6"
            },
            {
                texto: "12 meses",
                valor: "plazo_12"
            },
            {
                texto: "18 meses",
                valor: "plazo_18"
            },
            {
                texto: "24 meses",
                valor: "plazo_24"
            },
            {
                texto: "❌ Cancelar",
                valor: "cancelar"
            }
        ]
    },

    desconocido: {
        texto: "No reconocí esa opción. 🤔\n\nUtiliza uno de los botones disponibles para continuar.",
        opciones: [
            {
                texto: "🏠 Abrir menú",
                valor: "menu"
            }
        ]
    }
};

module.exports = respuestas;