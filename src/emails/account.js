const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'welcome@urwesley.de',
        subject: 'Welcome',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'later@urwesley.de',
        subject: 'Bye Bye',
        text: `Goodbye, ${name}. Have a good time.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}