var express = require('express')
    , multer = require('multer');

var app = express();
const player = 'c5bb5bd70ec7a4b755f3ad1137834e16';
const port = 10224;
var upload = multer({ dest: '/tmp/' });

app.post('/', upload.single('thumb'), function (req, res, next) {
    var payload = JSON.parse(req.body.payload);
    console.log('Got webhook for', payload.event);

    if (payload.Player.uuid = player && payload.event == "media.play" && payload.Metadata.type == "track") {
        console.log('Playing track', payload.Metadata.name);
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});