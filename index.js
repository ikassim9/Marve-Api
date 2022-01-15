require('dotenv').config();

const fetch = require('cross-fetch');
const express = require('express');
const app = express();
var CryptoJS = require("crypto-js");
const ts = new Date().getTime();
const str = ts + process.env.privateKey + process.env.apikey;
const hash = CryptoJS.MD5(str).toString().toLowerCase();
const base_url = new URL('http://gateway.marvel.com/v1/public');
const PORT = process.env.PORT



app.use(express.static('public/src'));

app.listen(PORT, function () {
    console.log("Express server listening on port", PORT);
});


app.get('/:heroName', async (req, res) => {
    const heroName = req.params.heroName;
    const hero = await getHero(heroName);

    // if the hero is not found, then send 404 status code
    if (hero.data.count < 1) {
        res.status(404).send('Character not found');



    } else {

        const heroID = hero.data.results[0].id;

        const comics = await getComics(heroID);
        res.json({
            hero: hero,
            comics: comics,
        });
    }






});

// send a get request to marvel api to retreive the given character
async function getHero(heroName) {

    const request = base_url + `/characters?name=${heroName}&ts=${ts}&apikey=${process.env.apiKey}&hash=${hash}`;
    const body = await fetch(request);
    const response = await body.json();
    return response;
}

// use character ID to retrieve the comics for the given character

async function getComics(heroID) {
    const request = base_url + `/characters/${heroID}/comics?ts=${ts}&apikey=${process.env.apiKey}&hash=${hash}`;
    let body = await fetch(request);
    let response = await body.json();
    return response;

}