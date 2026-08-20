import 'dotenv/config';

export const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { 
          name: 'Your App Name', 
          email: process.env.SENDER_EMAIL 
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Brevo Error: ${JSON.stringify(data)}`);
    }

    console.log('EMAIL SENT SUCCESSFULLY:', data);
    return data;
  } catch (error) {
    console.error('EMAIL SENDING ERROR:', error);
    throw error;
  }
};