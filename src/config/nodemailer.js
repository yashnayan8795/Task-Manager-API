import nodemailer from 'nodemailer';

import { EMAIL_PASSWORD } from './env.config.js'

export const accountEmail = 'nayanyash693@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: EMAIL_PASSWORD
  }
})

export default transporter;