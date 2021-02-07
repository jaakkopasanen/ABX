const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));
} else {
    app.use(express.static('public'));
}

app.use(express.json());

app.post('/submit', (req, res) => {
    console.log(JSON.stringify(req.body, null, 4));
});

app.listen(PORT, () => {
    console.log(`ABX app listening port ${PORT}`);
});
