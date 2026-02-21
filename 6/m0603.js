const nodemailer = require('nodemailer');

const USER_EMAIL = "тут почта отправителя";
const USER_PASS = "тут ключ от почты для возможности отправки";
const RECEIVER_EMAIL = "тут почта получателя";

const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: USER_EMAIL,  
                    pass: USER_PASS  
                },
            });


function send(message) {
       const options = {
                from: USER_EMAIL,           
                to: RECEIVER_EMAIL, 
                subject: "test",
                text: message,
                html: '<p>' + message + '</p>'
            };
        transporter.sendMail(options, (err, info) => {
           if (err) {
               console.log(err);
           } else {
               console.log(info);
           }
        });

}

module.exports = { send };