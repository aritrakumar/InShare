// const nodemailer = require("nodemailer");
// module.exports = async ({ from, to, subject, text, html}) => {
//         let transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: process.env.SMTP_PORT,
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: process.env.MAIL_USER, // generated ethereal user
//                 pass: process.env.MAIL_PASSWORD, // generated ethereal password
//             },
//         });

//         // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: `inShare <${from}>`, // sender address
//         to: to, // list of receivers
//         subject: subject, // Subject line
//         text: text, // plain text body
//         html: html, // html body
//     });
// }



const fetch = require('node-fetch');

module.exports = async ({ from, to, subject, text, html}) => {
    try {
        const brevoApiUrl = 'https://api.brevo.com/v3/smtp/email';
        
        const emailData = {
            sender: {
                name: "InShare",
                email: from || process.env.BREVO_SENDER_EMAIL
            },
            to: [
                {
                    email: to,
                    name: to.split('@')[0] // Use email username as name
                }
            ],
            subject: subject,
            textContent: text,
            htmlContent: html
        };

        const response = await fetch(brevoApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Brevo API error: ${response.status} - ${errorData}`);
        }

        const result = await response.json();
        console.log('Email sent successfully via Brevo API:', result.messageId);
        
        return {
            messageId: result.messageId,
            response: result
        };
        
    } catch (error) {
        console.error('Error sending email via Brevo API:', error);
        throw error;
    }
}
