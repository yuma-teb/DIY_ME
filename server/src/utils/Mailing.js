const nodemailer = require('nodemailer');

// create a node main
const sendEmail = async (mailObjective) => {
  // create a transpoter
  const transpoter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SENDER_MAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });
  // mail objective

  try {
    const info = await transpoter.sendMail(mailObjective);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = { sendEmail };
