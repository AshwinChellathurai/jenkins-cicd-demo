// app.js
const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => res.send('Hello from CI/CD with Jenkins, Docker & K8s!'));

app.listen(port, () => console.log(`App running on port ${port}`));
