const nodemailer = require('nodemailer')

exports.handler = async function (event, context) {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Payload required',
    }
  }

  const { name, email, message } = JSON.parse(event.body)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL_USER,
      pass: process.env.SENDER_EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.SENDER_EMAIL_USER,
    to: process.env.NUXT_EMAIL_CONTACT,
    subject: `New contact form submission from ${name}`,
    text: `You have a new contact form submission from:
      Name: ${name}
      Email: ${email}
      Message: ${message}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      body: 'Email sent successfully',
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`,
    }
  }
}
