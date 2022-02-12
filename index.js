var express = require('express')
    , multer = require('multer');

var app = express();
const player = 'c5bb5bd70ec7a4b755f3ad1137834e16';
const port = 10224;
var upload = multer({ dest: '/tmp/' });

app.post('/', upload.single('thumb'), function (req, res, next) {
    var payload = JSON.parse(req.body.payload);
    console.log('Got webhook for', payload.event, '\nOn device', payload.device);

    if (payload.Player.uuid === player && payload.event === "media.play") {
        console.log('Playing track', payload.Metadata.name);
        var url = "192.168.5.12";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.responseText);
            }
        };

        var data = `{
            "on": "t",
        }`;
        console.log('Sending data to WLED');
        xhr.send(data);
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});