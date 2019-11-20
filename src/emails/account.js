const sgMail = require('@sendgrid/mail')

const sendGridAPIkey = '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'

sgMail.setApiKey(sendGridAPIkey)

sgMail.send({
    to: 'wes.urb@gmail.com',
    from: 'noreply@urwesley.de',
    subject: 'test',
    text: 'blbalbalblaba'
})