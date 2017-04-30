var express = require('express');
var hgt = require('node-hgt');

var app = express();

var elevationdata = new hgt.TileSet('./data/hgt/');

app.use(express.static('static'));
app.use('/components', express.static(__dirname + '/bower_components'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/v1/elevation/point', (req, res) => {
    var latlng = [parseFloat(req.query.lat), parseFloat(req.query.lng)];
    elevationdata.getElevation(latlng, (err, elevation) => {
        console.log('Elevation @' + latlng + '=' + elevation);
        res.send({
            lat: latlng[0],
            lng: latlng[1],
            elevation: elevation,
        });
        res.end();
    });
});

app.get('/api/v1/sites/all', (req, res) => {
    var sites = [
        {
            name: 'SK0UX',
            position: [ 59.504170, 18.137724 ],
        },
        {
            name: 'SK0MT',
            position: [ 59.450127, 18.079311 ],
        }

    ];

    res.send(sites);
    res.end();
});

app.listen(8082, () => {
    console.log('listening on port 8082');
});
