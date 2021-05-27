const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = function(email,name){
    sgMail.send({
        to : email,
        from : 'aakash.shah.2401@gmail.com',
        subject : 'This is an Automated email. Welcome to the task-app!',
        text : `Hello ${name}. This is an automated email from aakash. Please do not disturb the legend.`
    })
    
}

const sendCancellationEmail = function(email,name){
    sgMail.send({
        to : email,
        from : 'aakash.shah.2401@gmail.com',
        subject : 'This is an Automated email. Welcome to the task-app!',
        text : `Hello ${name}. This is a cancellation email from aakash. Please do not disturb the legend.`
    })
    
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}