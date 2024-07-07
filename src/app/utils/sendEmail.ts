import nodemailer from 'nodemailer';
import config from '../config';

// :TODO incomplete this task

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'mdabdulsatter12345@gmail.com',
      pass: 'utui fsba aggv dhoq',
    },
  });

  await transporter.sendMail({
    from: 'mdabdulsatter12345@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10m', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
