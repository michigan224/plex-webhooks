import fetch from 'node-fetch';
import express from 'express';
import multer from 'multer';

var app = express();
const port = 10224;
var upload = multer({ dest: '/tmp/' });

app.post('/', upload.single('thumb'), function (req, res, next) {
    var payload = JSON.parse(req.body.payload);
    console.log('Got webhook for', payload.event,
        '\nOn device', payload.Player.title,
        '\nPlaying', payload.Metadata.title);
    console.log(payload)

    if (payload.Player.uuid === process.env.PLAYER_UUID && (payload.event === "media.play" || payload.event === "media.resume")) {
        const url = "http://" + process.env.WLED_IP + "/json/state"
        console.log('Turning off LEDs');
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "on": false }),
        }).then(resp => {
            console.log(JSON.stringify(resp, 0, 2));
        }).catch(err => {
            console.log(err);
        });
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});