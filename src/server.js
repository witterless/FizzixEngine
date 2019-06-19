const express = require('express');

let app = express();

app.use(express.static('src/public'));

app.listen(3000, () => console.log('Server ready'));
