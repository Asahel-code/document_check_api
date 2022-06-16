require('dotenv').config();
const nodemailer = require('nodemailer');


const generateOTP = () => {
    let otp = ''
    for (let i = 0; i <= 5; i++) {
        const randVal = Math.round(Math.random() * 9);
        otp += randVal;
    }
    return otp;
}

const mailTransport = () => nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

module.exports = {
    generateOTP,
    mailTransport
}