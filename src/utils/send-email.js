// utils/send-email.js
import { emailTemplates } from './email-template.js';
import dayjs from 'dayjs';
import transporter from '../config/nodemailer.js'; // Fixed import

export const sendReminderEmail = async ({ to, type, subscription }) => {
  try {
    if (!to || !type || !subscription) {
      throw new Error('Missing required parameters');
    }

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) throw new Error(`Template not found for type: ${type}`);

    // Validate user data
    if (!subscription.user?.email || !subscription.user?.name) {
      throw new Error('Invalid subscription user data');
    }

    const mailInfo = {
      userName: subscription.user.name,
      subscriptionName: subscription.name,
      renewalDate: dayjs(subscription.renewalDate).isValid() ?
        dayjs(subscription.renewalDate).format('MMM D, YYYY') :
        'Unknown Date',
      planName: subscription.plan?.name || subscription.name,
      price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
      paymentMethod: subscription.paymentMethod,
      daysLeft: type.match(/\d+/)?.[0] || 'X' // Extract days from type
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: template.generateSubject(mailInfo),
      html: template.generateBody(mailInfo)
    };

    // Use promise-based sending
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error; // Propagate error for handling upstream
  }
};