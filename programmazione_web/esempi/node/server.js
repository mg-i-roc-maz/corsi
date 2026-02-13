const http = require('http');
const express = require('express');

const server = http.createServer((req, res) => {
    // res.writeHead(200, { 'Content-Type': 'text/plain' });


    //res.writeHead(302, { 'Location': 'https://www.google.it' });


    res.writeHead(404, { 'Content-Type': 'text/plain' });




    // const os = require('os');

    // console.log('Platform:', os.platform());
    // console.log('CPU:', os.cpus().length);

    // res.end(os.platform() + ' - CPU cores: ' + os.cpus().length);

    res.end('Ciao dal server Node.js!');

});
server.listen(3000, () => {
    console.log('Server in ascolto su http://localhost:3000');
});