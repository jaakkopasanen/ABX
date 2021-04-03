require('dotenv').config();
const fs = require('fs');
const dateFormat = require('dateformat');
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const httpsRedirect = require('express-https-redirect');
const mailjet = require('node-mailjet');

const httpPort = parseInt(process.env.HTTP_PORT) || 80;
const httpsPort = parseInt(process.env.HTTPS_PORT) || 443;
const sslCert = process.env.SSL_CERT_PATH ? fs.readFileSync(process.env.SSL_CERT_PATH) : undefined;
const sslPrivateKey = process.env.SSL_PRIVATE_KEY_PATH ? fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH) : undefined;

const emailFromAddress = process.env.EMAIL_FROM_ADDRESS;
const emailFromName = process.env.EMAIL_FROM_NAME;
if (!process.env.MAILJET_API_KEY_PUBLIC) {
    throw 'MAILJET_API_KEY_PUBLIC environment variable must be a file path or key value';
}
if (!process.env.MAILJET_API_KEY_PRIVATE) {
    throw 'MAILJET_API_KEY_PRIVATE environment variable must be a file path or key value';
}
const mailjetApiKeyPublic = fs.existsSync(process.env.MAILJET_API_KEY_PUBLIC)
    ? fs.readFileSync(process.env.MAILJET_API_KEY_PUBLIC).toString().trim()
    : process.env.MAILJET_API_KEY_PUBLIC;
const mailjetApiKeyPrivate = fs.existsSync(process.env.MAILJET_API_KEY_PRIVATE)
    ? fs.readFileSync(process.env.MAILJET_API_KEY_PRIVATE).toString().trim()
    : process.env.MAILJET_API_KEY_PRIVATE;

const mailjetClient = mailjet.connect(mailjetApiKeyPublic, mailjetApiKeyPrivate);

// Express app
const app = express();
app.use(morgan('tiny'));
if (process.env.NODE_ENV === 'production' && sslPrivateKey && sslCert) {
    app.use('/', httpsRedirect());
}
app.use(express.json());

app.post('/submit', (req, res, next) => {
    if (emailFromAddress && req.body.email) {
        // const dateTime = new Date().toISOString()
        const dateTime = dateFormat(new Date(), 'UTC:yyyy-mm-dd HH:MM:ss Z');
        const jsonAttachment = {
            name: req.body.name,
            form: req.body.form,
            testResults: req.body.testResults,
            tagStats: req.body.tagStats,
        };
        mailjetClient.post('send', {version: 'v3.1'}).request({
            'Messages': [{
                'From': {
                    'Email': emailFromAddress,
                    'Name': emailFromName
                },
                'To': [{
                    'Email': req.body.email
                }],
                'Subject': `${req.body.name} test results ${dateTime}`,
                'HTMLPart': `<p>
A test participant has completed a listening test. Test results are in the attached JSON file
</p>
<p>
    You can also see the results here:
    <a href="${req.body.shareUrl}">${req.body.shareUrl}</a>
</p>`,
                'Attachments': [{
                    'ContentType': 'application/json',
                    'Filename': `${req.body.name} ${dateTime}.json`,
                    'Base64Content': Buffer.from(JSON.stringify(jsonAttachment, undefined, 4)).toString("base64")
                }]
            }]
        }).then((result) => {
            res.send('');
        }).catch((err) => {
            next(err);
        });
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));
    if (sslPrivateKey && sslCert) {
        https.createServer({
            key: sslPrivateKey,
            cert: sslCert
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
