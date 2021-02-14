const os = require('os');
const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const httpsRedirect = require('express-https-redirect');
const sendmail = require('sendmail');
const SMTPServer = require('smtp-server').SMTPServer;

const httpPort = parseInt(process.env.HTTP_PORT) || 80;
const httpsPort = parseInt(process.env.HTTPS_PORT) || 443;
const sslCertPath = process.env.SSL_CERT_PATH;
const sslPrivateKeyPath = process.env.SSL_PRIVATE_KEY_PATH;
const smtpPort = parseInt(process.env.SMTP_PORT);
const dkimPrivateKeyPath = process.env.DKIM_PRIVATE_KEY_PATH;
const dkimSelector = process.env.DKIM_SELECTOR;
const emailFromAddress = process.env.EMAIL_FROM_ADDRESS;

let dkimPrivateKey;
if (dkimPrivateKeyPath) {
    dkimPrivateKey = fs.readFileSync(dkimPrivateKeyPath);
}

// SMTP email server
let smtp;
if (smtpPort) {
    smtp = new SMTPServer();
    smtp.listen(smtpPort, null, () => {
        console.log(`SMTP server listening port ${smtpPort}`);
    });
}

// Express app
const app = express();
if (process.env.NODE_ENV === 'production' && sslPrivateKeyPath && sslCertPath) {
    app.use('/', httpsRedirect());
}
app.use(express.json());

app.get('/mail', (req, res) => {
    let emailOptions = {
        from: emailFromAddress,
        to: req.body.email,
        subject: `[ABX] test email`,
        html: 'Hello, world!'
    };
    if (dkimPrivateKey && dkimSelector) {
        // Add DKIM
        emailOptions.dkim = {
            privateKey: dkimPrivateKey,
            keySelector: dkimSelector
        };
    }
    sendmail(emailOptions, (err, reply) => {
        console.log(err && err.stack);
        // console.dir(reply);
    });
    res.send('Got mail!');
});

app.post('/submit', (req, res) => {
    console.log(JSON.stringify(req.body, null, 4));
    if (emailFromAddress && req.body.email) {
        const dateTime = new Date().toISOString()
        let emailOptions = {
            from: emailFromAddress,
            to: req.body.email,
            subject: `[ABX] ${req.body.name} test results ${dateTime}`,
            attachments: [{
                filename: `${req.body.name} ${dateTime}.json`,
                content: JSON.stringify(req.body, null, 4)
            }]
        };
        if (dkimPrivateKey && dkimSelector) {
            // Add DKIM
            emailOptions.dkim = {
                privateKey: dkimPrivateKey,
                keySelector: dkimSelector
            };
        }
        sendmail(emailOptions, (err, reply) => {
            console.log(err && err.stack);
            // console.dir(reply);
        });
    }
    res.send('');
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));
    if (sslPrivateKeyPath && sslCertPath) {
        https.createServer({
            key: fs.readFileSync(sslPrivateKeyPath),
            cert: fs.readFileSync(sslCertPath)
        }, app).listen(httpsPort, () => {
            console.log(`Production server listening port ${httpsPort} with HTTPS`);
        });
    }
    http.createServer({}, app).listen(httpPort, () => {
        console.log(`Production server listening port ${httpPort} with HTTP`);
    });


} else {
    app.use(express.static('public'));
    app.listen(httpPort, () => {
        console.log(`Development server listening port ${httpPort} with HTTP`);
    });
}
