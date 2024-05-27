"use server"

import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
import nodemailer from 'nodemailer';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
  ) {
  const THRESHOLD_PERCENTAGE = 40;
  // Shorten the product title
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `Bienvenue sur PriceWise pour ${shortenedTitle}`;
      body = `
      <div>
        <h2>Bienvenue chez PriceWise 🚀</h2>
        <p>Vous suivez désormais ${product.title}.</p>
        <p>Voici un exemple de la manière dont vous recevrez des mises à jour :</p>
        <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
          <h3>${product.title} est de nouveau en stock !</h3>
          <p>Nous sommes ravis de vous annoncer que ${product.title} est maintenant de nouveau disponible.</p>
          <p>Ne le manquez pas - <a href="${product.url}" target="_blank" rel="noopener noreferrer">achetez-le maintenant</a> !</p>
        </div>
        <p>Restez à l'écoute pour plus de mises à jour sur ${product.title} et d'autres produits que vous suivez.</p>
      </div>`;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} est de nouveau en stock !`;
      body = `
      <div>
        <h4>Hey, ${product.title} est maintenant réapprovisionné ! Procurez-vous le vôtre avant qu'ils ne soient à nouveau épuisés !</h4>
        <p>Voir le produit <a href="${product.url}" target="_blank" rel="noopener noreferrer">ici</a>.</p>
      </div>    
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Alerte du prix le plus bas pour ${shortenedTitle}`;
      body = `
      <div>
        <h4>Hey, ${product.title} a atteint son prix le plus bas jamais vu !!</h4>
        <p>Obtenez le produit <a href="${product.url}" target="_blank" rel="noopener noreferrer">ici</a> maintenant.</p>
      </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Alerte de réduction pour ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} est maintenant disponible avec une réduction de plus de ${THRESHOLD_PERCENTAGE}% !</h4>
          <p>Procurez-vous le immédiatement <a href="${product.url}" target="_blank" rel="noopener noreferrer">ici</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'hotmail',
  port: 2525,
  auth: {
    user: 'allebemathysmathoume@live.fr',
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1
})

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  const mailOptions = {
    from: 'allebemathysmathoume@live.fr',
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if(error) return console.log(error);
    
    console.log('Email sent: ', info);
  })
}