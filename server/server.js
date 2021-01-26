const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const bodyParser =  require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express()


app.use(express.json());

{/*connection to front end*/}
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true

}));
{/*use cookie parser*/}
app.use(cookieParser());
{/*use body parser*/}
app.use(bodyParser.urlencoded({extended: true}));

{/*create session*/}
app.use(session({
    key: "userId",
    secret: "g1616g",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }

}));
{/*establish connection to database*/}
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "TNTman222",
    database: "Users"

});

{/*register method*/}
app.post('/register', (req, res)=>{
    
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
        }
        db.query("INSERT INTO userDetails (username, password, email) VALUES (?,?,?)", 
        [username, hash, email], 
        (err, result)=>{
        console.log(err);
    
        });

    })
    
});

{/*checked if logged in method*/}
app.get('/checklogin', (req, res) => { 
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    }
    else {
        res.send({loggedIn: false})
    }
})


{/*login method*/}
app.post('/login', (req, res) => {
    const usernameEmail = req.body.usernameEmail
    const password = req.body.password


    db.query("SELECT * FROM userDetails WHERE username =? OR email =?", [usernameEmail, usernameEmail], 
    (err, result)=>{
        if(err) {
            console.log(err);
        }
        else if(result.length >0) {
            

            bcrypt.compare(password, result[0].Password, (err, response)=>{
                if(response){
                    req.session.user = result;
                    res.send(result);
                    
                    
                    
                }
                else {
                    res.send({message: "The password is incorrect"})
                }
            });
        }
        else{
            res.send({message: "This user doesnt exist"})
        }
        

    });
});

{/*log server is running*/}
app.listen(3001, () =>{
    console.log("Running server")
})