const express = require('express');
const path = require('path');
const db = require("./db/db.json");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const { text } = require('express');


const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard route to direct users to a 404 page
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public/pages/404.html'))
// );

app.get("/api/notes", (req, res)=> res.sendFile(path.join(__dirname, "/db/db.json")))

app.post("/api/notes", (req, res) => {

    const { title, text } = req.body;

    const newNote = {
        title,
        text,
        id: uuidv4(),
    }
    fs.readFile("./db/db.json", (err, data) => {
        const parsedNotes = JSON.parse(data)
        parsedNotes.push(newNote)

        fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (err) =>
            err
                ? console.log(err)
                : console.log("new Note Saved")
        )
    })
    res.sendFile(path.join(__dirname, "./db/db.json"))
})

app.delete("/api/notes/:id", (req, res) => {
    console.log("were in the backend delete route!")
    let textId = req.params.id;

    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"))

    noteList = noteList.filter(thisNote =>{
        return thisNote.id !== textId;
    })

    console.log("NOTE LIST", noteList)
    console.log("textID", textId)

    fs.writeFileSync('./db/db.json', JSON.stringify(noteList))
    res.json(noteList)

});



app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
