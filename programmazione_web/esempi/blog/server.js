const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Server web disponibile su http://localhost:${PORT}`);
});
