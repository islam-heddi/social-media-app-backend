const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
var number_of_users = 2;
const IndexMyElement = (arr , element) => {
    var index = 0;
    while(arr[index].email != undefined ){
        if(arr[index].email == element) return index;
        index ++;
        if(index >= number_of_users +1){
            break;
        }
    }
    return -1;
}

const FindEmail = (arr, email) => {
    var index = 0;
    while(arr[index].email != undefined) {
        if(arr[index].email == email) return true;
        index++;
        if(index >= number_of_users + 1){
            break;
        }
    }
    return false;
}

app.use(cors());

app.get('/users', cors(), (req, res, next) => {
    res.send(users);
});

let rawdata = fs.readFileSync('./db/users.json');
const users = JSON.parse(rawdata);
// console.log(users);

let rawdata1 = fs.readFileSync('./db/news.json');
const news = JSON.parse(rawdata1);

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"public")));

const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.render("index");
});

var erorr = "";

app.get('/login', (req,res) => {
    res.render("login",{
        problems : erorr 
    });
});

app.get('/register', (req,res) => {
    res.render("register",{
        problems : erorr
    });
});

app.post('/register', (req,res) => {
    const {username , password , email} = req.body;
    if(email == "" || password =="" || username == "") {
        erorr = "please fill them all";
        res.redirect("/register");
    }else{
        if(FindEmail(users,email)) {
            erorr = "That email is existed";
            return res.redirect("/register");
        }else {
            number_of_users++;
            erorr = "";
            users.push({
                username,
                email,
                password
            });
            console.log(users);
            res.redirect("/login");
        }
    }
    
});

var email_index = 0;
var username = users[email_index].username;
app.get('/main', (req,res) => {
    res.render("main", {
        name : username,
        data : news,
    });
});

app.post('/login', (req,res) => {
    const {email , password} = req.body;
    if(email == "" || password == ""){
        erorr = "please fill them all";
       return res.redirect("/login");
    }else{
        const IsExisted = FindEmail(users, email);
        console.log("is Existed : " + IsExisted);
        const index = IndexMyElement(users,email);
        console.log("email index : "+index);
        if(IsExisted && password == users[index].password) {
            erorr = "";
            email_index = index;
            username = users[index].username;
            res.redirect("main");
        }else{
            if(!IsExisted) erorr="Email not existed";
            else erorr="password does not match";
            res.redirect("login");
        }
    }
    
}); 

app.post('/main',(req,res) => {
    const { news_post } = req.body;
    const comments = [];
    const publish = news_post;
    let name = users[email_index].username;
    const id = Math.floor(Math.random() * 1000);
    news.push({
        id,
        name,
        publish,
        comments,
    });
    console.log(news);
    res.redirect('/main');
});

app.post('/comment/:id', (req,res) => {
    var { id } = req.params;
    const { comment } = req.body;
    const name = users[email_index].username;
    const index = news.findIndex(post => post.id == id);
    id = Math.floor(Math.random() * 1000);
    news[index].comments.push({
        id,
        name,
        comment
    });
    res.redirect("/main");
});

app.post('/delete/:id', (req,res) => {
    const id = req.params;
    const index = news.findIndex(post => post.id == id.id);
    news.splice(index, 1);
    return res.redirect('/main');
});

app.post('/delete-comment/:id:commentId', (req,res) => {
    const {id , commentId} = req.params;
    console.log("id : " + id + "\ncomment id : " + commentId);
    const index = news.findIndex(post => post.id == id);
    const commentid = news[index].comments.findIndex(post => post.id == id);
    news[index].comments.splice(commentid, 1);
    return res.redirect('/main');
});

app.listen(PORT, () => {
    console.log(`Your server is running on ${PORT}`);
});