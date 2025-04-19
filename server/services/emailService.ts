import sgMail from '@sendgrid/mail';

// Check if SendGrid API key is available
const isSendGridConfigured = process.env.SENDGRID_API_KEY !== undefined;

// Initialize SendGrid if API key is available
if (isSendGridConfigured) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  reason: string;
}

export const sendContactFormEmail = async (formData: ContactFormData): Promise<{success: boolean; message: string}> => {
  try {
    // If SendGrid is not configured, return a message
    if (!isSendGridConfigured) {
      console.warn('SendGrid API key is not configured. Email not sent.');
      return { 
        success: false, 
        message: 'Email service is not configured. Please contact support directly at support@imagenwiz.com.' 
      };
    }

    // Prepare the email
    const msg = {
      to: 'support@imagenwiz.com',
      from: 'no-reply@imagenwiz.com', // This should be your verified sender
      subject: `Contact Form: ${formData.subject}`,
      text: `
Name: ${formData.name}
Email: ${formData.email}
Reason: ${formData.reason}
Message: ${formData.message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #35B0AB;">New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${formData.name}</p>
  <p><strong>Email:</strong> ${formData.email}</p>
  <p><strong>Contact Reason:</strong> ${formData.reason}</p>
  <h3 style="color: #35B0AB;">Message:</h3>
  <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${formData.message.replace(/\n/g, '<br>')}</p>
</div>
      `,
      replyTo: formData.email,
    };

    // Send the email
    await sgMail.send(msg);
    
    return { success: true, message: 'Email sent successfully.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      message: 'Failed to send email. Please try again later or contact support directly at support@imagenwiz.com.' 
    };
  }
};