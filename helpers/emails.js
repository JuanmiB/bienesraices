import nodemailer from "nodemailer"

export const emailRegistrer = async (datos) => {

    // Crear un transporte usando SMTP
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // El servidor SMTP de tu proveedor de correo electrónico
        port: process.env.EMAIL_PORT, // El puerto SMTP, generalmente 587 o 465 para SMTP seguro
        auth: {
            user: process.env.EMAIL_USER, // Tu correo electrónico
            pass: process.env.EMAIL_PASS // Tu contraseña
        }
    });

    const { email, nombre, token } = datos

    // Envia mail de confirmacion
    await transporter.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
    <div class="container">
    <h1>Hola, ${nombre}</h1>
    <p>Gracias por registrarte en nuestro sitio. Por favor, confirma tu dirección de correo electrónico haciendo clic en el enlace de abajo.</p>
    <a href="${process.env.BACKEND_URL}auth/confirmarCuenta/${token}" class="btn">Confirmar Email</a>
    <p>Si no te has registrado en nuestro sitio, puedes ignorar este correo electrónico.</p>
    <p>Saludos,<br>Digital World</p>
</div>
    `
    })
}

export const emailRecoverPassword = async (datos) => {

    // Crear un transporte usando SMTP
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // El servidor SMTP de tu proveedor de correo electrónico
        port: process.env.EMAIL_PORT, // El puerto SMTP, generalmente 587 o 465 para SMTP seguro
        auth: {
            user: process.env.EMAIL_USER, // Tu correo electrónico
            pass: process.env.EMAIL_PASS // Tu contraseña
        }
    });

    const { email, nombre, token } = datos

    // Envia mail de confirmacion
    await transporter.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Recupera tu cuenta en BienesRaices.com',
        text: 'Recupera tu cuenta en BienesRaices.com',
        html: `
    <div class="container">
    <h1>Hola, ${nombre}</h1>
    <p>Parece ser que haz olvidado tu contraseńa y haz solicitado recuperarla</p>
    <p>Haz clic en el siguiente enlace para generar una nueva</p>
    <a href="${process.env.BACKEND_URL}auth/reset-password/${token}" class="btn">Confirmar Email</a>
    <p>Si no haz sido, puedes ignorar el este mensaje</p>
    <p>Saludos,<br>El equipo de Digimon Master Online</p>
</div>
    `
    })
}