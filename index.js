const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const cors = require('cors');
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.get('/users', cors(), (req, res, next) => {
    res.send(users);
});

let rawdata = fs.readFileSync('./db/users.json');
const users = JSON.parse(rawdata);
console.log(users);

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"public")));

const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.render("index");
});

app.get('/login', (req,res) => {
    res.render("login");
});

app.get('/register', (req,res) => {
    res.render("register");
});

var index = 0;

app.get('/main', (req,res) => {
    res.render("main", {
        name : users[index].username
    });
});

app.post('/user', (req,res) => {
    const {email , password} = req.body;
    const index = findIndex((element) => element=email);
    if(users.find((element) => element == email) != undefined && password == users[index].password) {
        res.redirect("main");
    }else{
        res.redirect("login");
    }
}); 

app.listen(PORT, () => {
    console.log(`Your server is running on ${PORT}`);
});