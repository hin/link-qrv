/*
 *
 * Copyright (c) 2017, Hans Insulander (SM0UTY)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 */

var express = require('express');
var hgt = require('node-hgt');
var geodesy = require('geodesy');

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

app.get('/api/v1/elevation/line', (req, res) => {
    var latlng0 = new geodesy.LatLonEllipsoidal(parseFloat(req.query.lat0),
                                                parseFloat(req.query.lng0));
    var latlng1 = new geodesy.LatLonEllipsoidal(parseFloat(req.query.lat1),
                                                parseFloat(req.query.lng1));
    var stepLength = 30.0;
    if (req.query.step != undefined)
        stepLength = parseFloat(req.query.step);
    var totalDistance = latlng0.distanceTo(latlng1);
    var initialBearing = latlng0.initialBearingTo(latlng1);
    var finalBearing = latlng0.finalBearingTo(latlng1);
    var numSteps = Math.ceil(totalDistance/stepLength);
    var realStepLength = totalDistance / numSteps;
    var result = {
        totalDistance: totalDistance,
        initialBearing: initialBearing,
        finalBearing: finalBearing,
        stepLength: realStepLength,
        numPoints: 0,
        points: new Array(numSteps),
    };
    for (var i = 0; i < numSteps; i++) (function(index) {
        var distance = realStepLength * index;
        var point = latlng0.destinationPoint(distance, initialBearing);

        elevationdata.getElevation([point.lat, point.lon], (err, elev) => {
            result.points[index] = [point.lat, point.lon, elev];
            result.numPoints++;
            /* Check if we've got all the points on the line */
            if (result.numPoints == numSteps) {
                res.send(result);
                res.end();
            }
        });
    })(i);
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
        { sites: [1, 2] },
        { sites: [0, 2] },
        { sites: [0, 3] },
    ];

    res.send(links);
    res.end();
});

app.listen(8082, () => {
    console.log('listening on port 8082');
});
