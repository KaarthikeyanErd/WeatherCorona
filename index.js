const express = require('express');
const datastore = require('nedb');
const database = new datastore('database.db');
const fetch = require('node-fetch');
require('dotenv').config();
database.loadDatabase();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('Public'));
app.use(express.json({ limit: '1mb' }));

app.listen(port, () => {

    console.log("Port @ ", port);
});

app.get('/location', (req, res) => {
    database.find({}, (err, data) => {
        if (err) {
            console.log("Error occured");
            res.end();
            return;
        }
        else {
            res.json(data);
        }
    });
});

app.post('/location', (req, res) => {

    const timestamp = Date.now();
    req.body.timestamp = timestamp;
    database.insert(req.body);
    res.json(req.body);
});

app.get("/key", (req, res) => {
    key = process.env.API_KEY;
    res.json(key);
});


app.get("/weather/:latlonapi", async (req, res) => {

    let latlonapi = req.params.latlonapi.split(",");
    let latitude = latlonapi[0];
    let longitude = latlonapi[1];
    let key = latlonapi[2]

    let weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    let data = await fetch(weather_url);
    let weather = await data.json();
    res.json(weather);
});

app.get("/case/:countrycode", async (req, res) => {

    let country_code = req.params.countrycode;
    let url = `https://api.thevirustracker.com/free-api?countryTimeline=${country_code}`;
    let data = await fetch(url);
    let case_details = await data.json();
    res.json(case_details);

});

app.get("/dis_state/:latlon", async (req, res) => {

    let latlon = req.params.latlon.split(",");
    let latitude = latlon[0];
    let longitude = latlon[1];

    let disstate_url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=8ab01065063848469ed7983e2b8ef7af`;
    let data = await fetch(disstate_url);
    let dis_state_details = await data.json();
    res.json(dis_state_details);

});

app.get("/state_case/:disstate", async (req, res) => {

    let country_code = req.params.disstate;
    let state_case_url = `https://api.covid19india.org/state_district_wise.json`;
    let data = await fetch(state_case_url);
    let case_details = await data.json();
    res.json(case_details);

});
