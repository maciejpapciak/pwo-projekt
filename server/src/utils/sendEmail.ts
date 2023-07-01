import nodemailer from 'nodemailer';
import logger from './logger';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: 'SendinBlue',
    auth: {
      user: process.env.SENDINBLUE_USER,
      pass: process.env.SENDINBLUE_PASS,
    },
  });

  const mailContext = await transporter.sendMail({
    from: '<noreply@elearnr.rocks>',
    to,
    subject,
    html,
  });

  logger.debug(`Email has been sent: ${mailContext.messageId}`);
};
