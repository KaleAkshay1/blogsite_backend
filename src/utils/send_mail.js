import nodemailer from "nodemailer";

const sendMail = async (to, sub, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOption = {
      from: process.env.EMAIL,
      to: to,
      subject: sub,
      text: text,
    };

    let result = await transporter.sendMail(mailOption);
    return true;
  } catch (error) {
    return false;
  }
};

export default sendMail;
