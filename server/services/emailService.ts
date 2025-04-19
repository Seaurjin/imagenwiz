// Contact form email service using NodeMailer with SMTP
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  reason: string;
}

// Store submissions in memory as backup (in case email fails)
const contactSubmissions: ContactFormData[] = [];

// Check if SMTP is configured
const isSmtpConfigured = process.env.SMTP_HOST && 
                         process.env.SMTP_PORT && 
                         process.env.SMTP_USER && 
                         process.env.SMTP_PASS;

// Create nodemailer transporter using SMTP if configured
const transporter = isSmtpConfigured 
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'), 
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export const sendContactFormEmail = async (formData: ContactFormData): Promise<{success: boolean; message: string}> => {
  try {
    // Always log submission for tracking regardless of email success
    const submissionText = `
========================================
📬 NEW CONTACT FORM SUBMISSION
========================================
Date: ${new Date().toISOString()}
Name: ${formData.name}
Email: ${formData.email}
Reason: ${formData.reason}
Subject: ${formData.subject}
----------------------------------------
Message:
${formData.message}
========================================
    `;
    
    // Store the submission in memory as backup
    contactSubmissions.push(formData);
    
    // Log the submission to the console
    console.log(submissionText);
    console.log(`Total contact form submissions: ${contactSubmissions.length}`);
    
    // If SMTP is not configured, just return success from logging
    if (!isSmtpConfigured || !transporter) {
      console.warn('SMTP not configured. Email not sent, but submission logged.');
      return { 
        success: true, 
        message: 'Thank you for your message. Our team will review it and get back to you soon.' 
      };
    }
    
    // Create HTML content for the email
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #35B0AB;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Contact Reason:</strong> ${formData.reason}</p>
      <h3 style="color: #35B0AB;">Message:</h3>
      <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${formData.message.replace(/\n/g, '<br>')}</p>
    </div>
    `;
    
    // Set up email data
    const mailOptions = {
      from: `"iMagenWiz Contact" <${process.env.SMTP_USER}>`,
      to: 'support@imagenwiz.com', // Primary recipient
      replyTo: formData.email,
      subject: `Contact Form: ${formData.subject}`,
      text: `
Name: ${formData.name}
Email: ${formData.email}
Reason: ${formData.reason}
Subject: ${formData.subject}

Message:
${formData.message}
      `,
      html: htmlContent
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    // Return success
    return { 
      success: true, 
      message: 'Thank you for your message. Our team will get back to you soon.' 
    };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    
    // Email failed but we still logged the submission
    return { 
      success: false, 
      message: 'There was an error sending your message. Please try again later or email support@imagenwiz.com directly.' 
    };
  }
};