/*
    Video: https://www.youtube.com/watch?v=Va9UKGs1bwI
    Don't forget to disable less secure app from Gmail: https://myaccount.google.com/lesssecureapps TODO:
*/

require("dotenv").config();

const nodemailer = require("nodemailer");
const axios = require("axios");
const log = console.log;

// Step 1
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL || "abc@gmail.com", // TODO: your gmail account
    pass: process.env.PASSWORD || "1234", // TODO: your gmail password
  },
});

// Step 2
let mailOptions = [
  {
    from: process.env.EMAIL, // TODO: email sender
    to: process.env.EMAIL, // TODO: email receiver
    subject: "GET THE PLACE MAN",
    text: "RN",
  },
];

// Step 3

const sendMail = () => {
  mailOptions.forEach((mailOption) => {
    transporter.sendMail(mailOption, (err, data) => {
      if (err) {
        console.log(err);
        return log("Error occurs");
      }
      return log("Email sent!!!");
    });
  });
};

const checkAvailability = async () => {
  try {
    console.log("------------------");

    const res = await axios.get(process.env.URL);
    //   console.log(res);

    if (res.status !== 200) throw new Error("Error occurs");

    const data = res.data;
    const noRoom = data.includes(`<div class="ui-results"></div>`);

    if (!noRoom) {
      sendMail();
      console.log("GOT THE ROOM");
      return false;
    }

    console.log("NO ROOM");
    return true;
  } catch (error) {
    console.error(error);
    return true; // Return true to continue the loop even if there's an error
  }
};

function repeatCheckAvailability() {
  checkAvailability()
    .then((hasRoom) => {
      if (hasRoom) {
        setTimeout(repeatCheckAvailability, 300000); // Execute every 5 minutes
      }
    })
    .catch((error) => {
      console.error(error);
      setTimeout(repeatCheckAvailability, 300000); // Execute every 5 minutes
    });
}

repeatCheckAvailability();
