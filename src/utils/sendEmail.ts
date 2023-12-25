import nodemailer from 'nodemailer';

export const sendEmail = async (verifyUrl: string, email: string) => {
    try {

        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // Replace with your SMTP server host
            port: 587, // Replace with your SMTP server port (587 is a common TLS port)
            secure: false, // Use TLS
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Mail from Karwaan',
            html: `<p>Click the following link to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`
        };

        await transport.sendMail(mailOptions).catch((error) => console.log(error));
    } catch (error) {
        throw error;
    }
};
