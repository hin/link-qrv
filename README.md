# Link-QRV

Copyright @ 2017 Hans Insulander (SM0UTY) <hans@codium.se>.

Link-QRV is a tool for radio link planning. It is currently a work in progress
and is not really usable yet.

## Planned features

There are some planned features, in no particular order:
* Placement of sites
* Placement of links between sites
* Terrain profile of links between sites
* Include earth curvature in terrain profile
* Plot Fresnel zone in profile
* Saving user data in a database
* Radio propagation simulation of links beteen sites
* User authentication
* Multiple maps per user
* Sharing maps between users
* Read-only publicly visible maps with a static URL
* Downloadable maps in GeoJSON format

## Running Link-QRV

### Prerequisites

To run Link-QRV, you need a Linux or Mac OS X machine with:
* NodeJS
* NPM
* Bower

### Installing

Install NPM packages:
```npm install```

Next, install Bower packages:
```bower install```

Create directory for downloaded HGT files:
```mkdir -p data/hgt```

Run Link-QRV:
```node index.js```

You can now access Link-QRV at http://localhost:8082
