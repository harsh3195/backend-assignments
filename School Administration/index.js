const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const studentArray = require('./InitialData');
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get('/api/student', (req,res) => {
    res.send(studentArray);
});

app.get('/api/student/:studentId' , (req,res) => {
    const studentId = req.params.studentId;
    let found = false;

    studentArray.forEach((student) => {
        if(student.id == studentId) {
            found = true;
            res.send(student);
        }
    });
    if(!found) {
        res.sendStatus(404);
    }
});

app.post('/api/student',(req,res) => {
    const body = req.body;
    let newId = studentArray.length;

    if(body.name !== "" && body.currentClass !== "" && body.division !== ""){
        newId++;
        const newStudent = {
            id: Number(newId),
            name: body.name,
            currentClass: Number(body.currentClass),
            division: body.division
        };
        studentArray.push(newStudent);

        res.send({
            id: newId
        });
    }
    else{
        res.sendStatus(400);
    }
});

app.put('/api/student/:studentId',(req,res) => {
    const body = req.body;

    if(body.name !== "" && body.currentClass !== "" && body.division !== ""){
        const studentId = Number(req.params.studentId);
        let found = false;

        studentArray.forEach((student) => {
            if(student.id == studentId){
                found = true;

                if(body.hasOwnProperty("name")){
                    student.name = body.name;
                }
                if(body.hasOwnProperty("currentClass")){
                    student.currentClass = Number(body.currentClass);

                }
                if(body.hasOwnProperty("division")) {
                    student.division = body.division;
                }

                res.sendStatus(200);
            }
        });
        if(!found){
            res.sendStatus(400);
        }
    }
    else{
        res.sendStatus(400);
    }
});

app.delete("/api/student/:studentId", (req,res) => {
    const studentId = Number(req.params.studentId);
    let idToDelete = 0;
    let found = false;
    studentArray.forEach((student, idx) => {
        if(student.id === studentId){
            found = true;
            idToDelete = idx;
        }
    });
    if(!found) {
        res.sendStatus(404);
    }
    else{
        studentArray.splice(idToDelete, 1);
        res.sendStatus(200);
    }
});






app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   