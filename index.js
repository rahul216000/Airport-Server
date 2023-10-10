const express = require('express');
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;
const path = require("path")
const fs = require('fs');
const cors = require('cors');

dotenv.config({ path: './config.env' });
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
    origin: [
        // 'http://127.0.0.1:5500',
        'https://airport-form.netlify.app'
    ]
}));

app.use(express.json())
app.use(require('./Router/SearchFeature'));
app.use(require('./Router/RequestFeature'));
app.use(require('./Router/Admin'));


// Francesca.smith@topjet.aero
// Topjet2023!

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    } else {
        console.log('Server not started ' + error);
    }

});