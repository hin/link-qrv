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
            id: 0,
            position: { lat: 59.504170, lng: 18.137724 },
        },
        {
            name: 'SK0MT',
            id: 1,
            position: { lat: 59.450127, lng: 18.079311 },
        },
        {
            name: 'SK0BU',
            id: 2,
            position: { lat: 59.348051, lng: 18.074896 },
        },
        {
            name: 'SK0RYG',
            id: 3,
            position: { lat: 59.523850, lng: 17.922381 },
        },
    ];

    res.send(sites);
    res.end();
});

app.get('/api/v1/links/all', (req, res) => {
    var links = [
        { id: 0, sites: [1, 2] },
        { id: 1, sites: [0, 2] },
        { id: 1, sites: [0, 3] },
    ];

    res.send(links);
    res.end();
});

app.listen(8082, () => {
    console.log('listening on port 8082');
});
