const respuestas = {

    menu: {
        texto: "🏠 Bienvenido a nuestro servicio de préstamos.\n\n¿En qué información estás interesado?",
        opciones: [
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
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    tasas: {
        texto: "💵 Tasas de interés\n\nLa tasa de interés dependerá del monto solicitado y del plazo acordado.\n\nPara conocer la tasa correspondiente a un préstamo específico, puedes contactar a un asesor.",
        opciones: [
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
                texto: "🏠 Menú principal",
                valor: "menu"
            }
        ]
    },

    cuota: {
        texto: "🧮 Ejemplo de cuota\n\nEjemplo:\n\n💰 Monto: RD$20,000\n💵 Interés: 10%\n📅 Plazo: 10 cuotas\n\nEl cálculo de la cuota dependerá del método de interés utilizado.\n\nEste ejemplo es únicamente informativo.",
        opciones: [
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
                texto: "🏠 Menú principal",
                valor: "menu"
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