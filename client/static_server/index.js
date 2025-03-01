const express = require('express');
const path = require('path');
const app = express();

// serve index.html for everything
const DIST_DIR = "../dist"
app.use(express.static(path.join(__dirname, DIST_DIR)));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, DIST_DIR, "index.html"));
});

// start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
