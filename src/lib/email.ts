
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
// Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: '"My App" <light@myapp.com>',
      to: to, 
      subject: subject, 
      text: "This is a plain text backup",
      html: html, 
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Error sending email' }, { status: 500 });
  }
}

export function generateNewsletterHtml(
  title: string,
  content: string,
  unsubscribeUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #4f46e5, #06b6d4); color: white; padding: 20px; border-radius: 8px; }
          .content { padding: 20px 0; }
          .footer { border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; }
          a { color: #4f46e5; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}
