const nodemailer = require('nodemailer');
const logger = require('./logger');

const createTransport = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = createTransport();
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'WoolMonitor <no-reply@woolmonitor.com>',
            to,
            subject,
            html,
            text,
        });
        logger.info(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error(`Email send failed to ${to}: ${error.message}`);
        throw error;
    }
};

const sendWelcomeEmail = (user) => sendEmail({
    to: user.email,
    subject: 'Welcome to WoolMonitor',
    html: `<h2>Welcome, ${user.name}!</h2><p>Your account has been created successfully as a <strong>${user.role}</strong>.</p>`,
});

const sendPasswordResetEmail = (user, resetUrl) => sendEmail({
    to: user.email,
    subject: 'Password Reset - WoolMonitor',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 10 minutes.</p>`,
});

module.exports = { sendEmail, sendWelcomeEmail, sendPasswordResetEmail };
