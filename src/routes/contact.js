var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer')
require("dotenv").config()
// POST route from contact form
router.post('/', (req, res) => {

    // Instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    })
  
    // Specify what the email will look like
    const mailOpts = {
      from: 'Checkers contact form', // This is ignored by Gmail
      to: process.env.DEV_TEAM,
      subject: 'New message from contact form at checkers',
      text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    }
  
    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
        console.log(response)
        console.log(error)
      if (error) {
          res.json({success: false})
      }
      else {
        res.json({success: true})
      }
    })
  })


module.exports = router;
