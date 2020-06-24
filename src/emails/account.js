const sgMail = require('@sendgrid/mail');

const EMAIL = 'eduardoegb@gmail.com';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (name, email) => {
  sgMail.send({
    to: email,
    from: EMAIL,
    subject: 'Thanks for joining in!',
    text: `Hello, ${name}. Welcome to Task App! Let me know how you get along with the app.`
  });
}

const sendCancelationEmail = (name, email) => {
  sgMail.send({
    to: email,
    from: EMAIL,
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}. We are sorry you left us, we hope you return soon.`
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}