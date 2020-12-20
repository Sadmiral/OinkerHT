const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');

const app = express();

const db = monk('localhost/oinkers');
const oinks = db.get('oinks');
const filter = new Filter();

//MIDDLEWARE
//add cors headers to requests automatically 
app.use(cors());
//json body parser for incoming requests
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Oinkers! 🐷'
    });
});

app.get('/oinks',  (req, res) => {
    oinks
        .find()
        .then(oinks => {
            res.json(oinks);
        });
});

//Check that the user input is not empty and name is <= 30 characters and content <= 100 characters
function isValidOink(oink) {
    return oink.name && oink.name.toString().trim() != '' && 
    oink.content && oink.content.toString().trim() != '' && oink.name.toString().length <= 30 && oink.content.toString().length <= 100;
}

app.post('/oinks', (req, res) => {
    if (isValidOink(req.body)) {
        const oink ={
            //filter swear words (not necessarily Finnish)
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
    };

    oinks
        .insert(oink)
        .then(createdOink => {
            res.json(createdOink);
        });
    } else {
        res.status(422);
        res.json({
            message: 'Name and Oink! are required! Make sure you arent surpassing the character limit!'
        });
    }
    
});

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});

