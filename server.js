// dependencies

const express = require("exress");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")

// set up express app

let app = express();
let PORT = process.env.PORT || 3000;

// link to assets
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// On page load, it should start with index.html. First get it and then listen.

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

//notes html and it's corresponding url
app.get("/notes", function (req, res) {
    res.sendfile(path.join(__dirname, "/public/notes.html"));
})

// --------------------------------------------------
// GET, POST, DELETE API Endpoints.
//---------------------------------------------------

// Since the GET and POST functions grab from the same router, we can set it up once right here

