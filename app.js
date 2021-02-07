const path = require('path');
const express = require('express');
const https = require('https');

const app = express();
const PORT = parseInt(process.env.PORT) || 3001;
const CERT_PATH = process.env.CERT_PATH;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;

app.use(express.json());

app.post('/submit', (req, res) => {
    console.log(JSON.stringify(req.body, null, 4));
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));
    https.createServer({
        key: PRIVATE_KEY_PATH,
        cert: CERT_PATH
    }, app).listen(PORT, () => {
        console.log(`Production server listening ${PORT}`)
    })

} else {
    app.use(express.static('public'));
    app.listen(PORT, () => {
        console.log(`ABX app listening port ${PORT}`);
    });
}
