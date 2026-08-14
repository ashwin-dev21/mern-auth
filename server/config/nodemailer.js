// import nodemailer from "nodemailer";
// import "dotenv/config";

// const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     secure: false,

//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },

//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 15000,
// });

// transporter.verify((error, success) => {
//     if (error) {
//         console.error("SMTP CONNECTION ERROR:");
//         console.error(error);
//     } else {
//         console.log("SMTP SERVER READY");
//     }
// });

// export default transporter;