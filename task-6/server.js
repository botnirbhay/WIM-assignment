const express = require("express");
const app = express();
const PORT = 3000;

const accountSid = "AC794c1c15059d5de99eb858495ebabd41";
const authToken = "1969ee815a558e9d19756b805f9ae083";
const serviceId = "";

const client = require("twilio")(accountSid, authToken);

app.use(express.static("public"));
app.use(express.json());

app.get(`/`, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post(`/send-verification-otp`, (req, res) => {
  const { mobileNumber } = req.body;

  client.verify
    .services(serviceId)
    .verifications.create({ to: "+91" + mobileNumber, channel: "sms" })
    .then((verification) => {
      return res.status(200).json({ verification });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
});

app.post(`/verify-otp`, (req, res) => {
  const { mobileNumber, code } = req.body;
  client.verify
    .services(serviceId)
    .verificationChecks.create({ to: "+91" + mobileNumber, code })
    .then((verification_check) => {
      return res.status(200).json({ verification_check });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
