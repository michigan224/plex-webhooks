import fetch from 'node-fetch';
import express from 'express';
import multer from 'multer';

var app = express();
const port = 10224;
const url = "http://" + process.env.WLED_IP + "/json/state"
var upload = multer({ dest: '/tmp/' });
var resumed = false;

app.post('/', upload.single('thumb'), function (req, res, next) {
    var payload = JSON.parse(req.body.payload);

    if (payload.Player.uuid !== process.env.PLAYER_UUID) return;

    console.log('Got webhook for', payload.event, 'Playing', payload.Metadata.title);

    if (payload.event === "media.play" || payload.event === "media.resume") {
        resumed = true;
        console.log('Turning off LEDs...');
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "on": false }),
        }).then(resp => {
            console.log('LEDs off');
        }).catch(err => {
            console.log(err);
        });
    } else if (resumed && (payload.event === "media.pause" || payload.event === "media.stop")) {
        resumed = false;
        setTimeout(checkPause, 10000);
    }
});

function checkPause() {
    if (resumed) return;
    console.log('Turning on LEDs dimmed...');
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "on": true, "bri": 15 }),
    }).then(resp => {
        console.log('LEDs dimmed');
    }).catch(err => {
        console.log(err);
    });
}

app.listen(port, () => {
    console.log(`WLED Plex Webhooks listening on port ${port}`)
});