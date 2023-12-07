require("dotenv").config()

const execSync = require("child_process").execSync;
const nodemailer = require("nodemailer");
const fs = require("fs");

const participants = require("./participants.json")

// a 2000x1414 picture, with the name space in the middle
let templateImage = "template1.png";

let xOffset = 0;
let yOffset = 80;
let fontSize = 80;


// testing array
// const participants = [
//   {
//     name: "Salah Eddine Makdour",
//     email: "salah-eddine.makdour@ensia.edu.dz",
//   }
// ];


const user = process.env.EMAIL;
const pass = process.env.PASS

const transportConfig = {
  service: "Gmail",
  user: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  auth: {
    user: user,
    pass: pass,
  },
};

// we'll later extend this object with more info like: to, body and attachments
let mailOptions = {
  from: user,
  subject: "HackStart participation certificate",
};

// initializing the transporter object
const transporter = nodemailer.createTransport(transportConfig);

Promise.all(
  // looping over the participants array to send them the emails
  participants.map(async ({ name, email }, i) => {

    // i is the index, just to print the progress in the console
    await sendCertificate(name, email, i);
  })
).then(() => {
  transporter.close();
});



async function sendCertificate(fullname, email, i) {
  // Write your email here
  const body = `Hello ${fullname},<br><br>
    
    The ETC team is happy to attach your <b>HackStart 2023 participation Certificate</b>, appreciating your efforts and creativity.<br><br>

    We hope this edition was a successful learning opportunity for you and your team to collaborate and put your skills in the field! <br><br>
    
    And of course... STAY ETC.<br><br>

    ENSIA Tech Community`;

  const command = `bash script.sh -n "${fullname}" -t ${templateImage} -s ${fontSize} -x ${xOffset} -y ${yOffset}`;

  console.log(command)

  try {
    // generate the certificate in the results folder
    execSync(command);

  } catch (error) {
    console.log(
      "there was an error while running the certificate generation command",
      email
    );
  }

  mailOptions = {
    ...mailOptions,
    html: body,
    attachments: [
      {
        // stream as an attachment
        filename: "HackStart_Participant_Certificate.png",
        content: fs.createReadStream(`results/certificate_${fullname}.png`),
      },
    ],
    to: email,
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log(`${i + 1}/${participants.length} Sent to: ${email}`);
  } catch (error) {
    console.log("There was an error while sending the email", email);
    console.log(error);
  }
}
