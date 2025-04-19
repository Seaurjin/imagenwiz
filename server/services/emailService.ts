// Simple contact form submission logger (no external email service required)

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  reason: string;
}

/**
 * Instead of sending an actual email, we'll log the contact form submission to the console
 * and save it to an in-memory array. This is a temporary solution until a proper email
 * service is integrated.
 */
const contactSubmissions: ContactFormData[] = [];

export const sendContactFormEmail = async (formData: ContactFormData): Promise<{success: boolean; message: string}> => {
  try {
    // Format the submission for logging
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
    
    // Store the submission in memory
    contactSubmissions.push(formData);
    
    // Log the submission to the console
    console.log(submissionText);
    console.log(`Total contact form submissions: ${contactSubmissions.length}`);
    
    // Return success
    return { 
      success: true, 
      message: 'Thank you for your message. Our team will review it and get back to you soon.' 
    };
  } catch (error) {
    console.error('Error logging contact form submission:', error);
    return { 
      success: false, 
      message: 'There was an error processing your request. Please try again later or contact support directly at support@imagenwiz.com.' 
    };
  }
};