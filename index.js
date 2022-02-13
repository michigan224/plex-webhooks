const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');

var app = express();
const player = 'c5bb5bd70ec7a4b755f3ad1137834e16';
const port = 10224;
var upload = multer({ dest: '/tmp/' });

app.post('/', upload.single('thumb'), function (req, res, next) {
    var payload = JSON.parse(req.body.payload);
    console.log('Got webhook for', payload.event, '\nOn device', payload.Player.title);

    if (payload.Player.uuid === player && payload.event === "media.play") {
        console.log('Playing track', payload.Metadata);

        fetch("192.168.5.12", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: {
                "on": "t",
            },
        }).then(resp => { return resp.json() }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});