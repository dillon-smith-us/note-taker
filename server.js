// dependencies

const express = require("express");
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
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// --------------------------------------------------
// GET, POST, DELETE API Endpoints.
//---------------------------------------------------

// Since the GET and POST functions grab from the same router, we can set it up once right here

app.route("/api/notes")
    // grab the notes list (this should be updated for every new note and deleted note.)
    .get(function (req, res) {
        res.json(database);
    })

    // add a new note to the json database
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        // this allows the test note to be the first note.
        let highestId = 99;
        // this will loop through the array and find the highest ID.
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];
            if (individualNote.id > highestId) {
                // highestId will always be the highest numbered id in notesArray
                highestId = individualNote.id;
            }
        }
        // This assigns an ID to the newNote.
        newNote.id = highestId + 1;
        // We push it to db.json.
        database.push(newNote)

        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("New note saved.");
        });
        // gives back the response, which is the user's new note
        res.json(newNote);
    });

    //---------------
    // delete a note based on an ID (cannot be location in array, the location will change if splicing occurs.)
    // this route is dependent on ID of note.
    // 1) find note by id via a loop
    // 2) splice note out of notesArray
    // 3) rewrite db.json without the deleted note.
    //-----------------

    app.delete("/api/notes/:id", function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        // request to delete note by id here
        for (let i = 0; i < database.length; i++) {
            if (database[i].id == req.params.id) {
                // splice takes i position, and then deletes the i position note.
                database.splice(i, 1);
                break;
            }
        }
        // write the db.json file again.
        fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {
            if (err) {
                return console.log(err);
            } else {
                console.log("Note deleted.");
            }
        });
        res.json(database);
    });

    //--------
    // express needs to listen. Sets up server.
    //--------

    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });


    