const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const bodyParser =  require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express()


app.use(express.json({
  limit: '30mb'
}));

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
    password: "f29so",
    database: "profile"
});

db.connect((err) => {
  if(err){
    console.log(err);
  }
  console.log('MySQL Connected');
});

{/*register method*/}
app.post('/register', (req, res)=>{

    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err !== null){
            console.log(err);
        }
        if(email === ""){
            db.query("INSERT INTO profile.userDetails (username, password) VALUES (?,?)",
            [username, hash],
            (err, result)=>{
                if(err !== null){
                    if(err.errno === 1062){
                        res.send({message: "Duplicate user"});
                    }
                }
                else{
                    req.session.user = result;
                }
            });
        } else {
            db.query("INSERT INTO profile.userDetails (username, password, email) VALUES (?,?,?)",
            [username, hash, email],
            (err, result)=>{
                if(err !== null){
                    if(err.errno === 1062){
                        res.send({message: "Duplicate user"});
                    }
                }
                else{
                    req.session.user = result;
                }
        });
        }
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

app.post('/updateTable', (req, res) =>{
    db.query("SELECT * FROM profile.userDetails", (err, result) => {
        console.log("update err" + err)
        res.send(result);
    })
})


app.post('/refresh', (req, res) =>{
    db.query("SELECT * FROM profile.userDetails ORDER BY userID DESC LIMIT 1", (err, result) => {
        console.log(result)
        console.log("refresh err" + err)
        res.send(result);

    })
})

{/*login method*/}
app.post('/login', (req, res) => {
    const usernameEmail = req.body.usernameEmail
    const password = req.body.password

    db.query("SELECT * FROM profile.userDetails WHERE username =? OR email =?", [usernameEmail, usernameEmail],
    (err, result)=>{
        if(err) {
            console.log(err);
        }
        else if(result.length >0) {

            bcrypt.compare(password, result[0].password, (err, response)=>{
                if(response){
                    req.session.user = result;
                    res.send(result);
                }
                else {
                    res.send({message: "The password is incorrect"})
                    console.log(err);
                }
            });
        }
        else{
            console.log("login error " + err)
            console.log("login result " + result)
            res.send({message: "This user doesnt exist"})
        }


    });
});


app.post('/setDetails', (req, res) => {
    const firstName = req.body.firstName
    const secondName = req.body.secondName
    const description = req.body.description
    const username = req.body.username


    db.query("INSERT INTO profile.profile (username, fname, lname, description) VALUES (?,?,?,?)", [username, firstName, secondName, description],
    (err, result)=>{
        if(err) {
            console.log("setdetails error " +err);
        }
        res.send({message: "changed details"})
        console.log("details error " + err)
        console.log("details result " + result)
    });
});

app.post('/posts', (req, res) => {
    const username = req.body.username
    const description = req.body.description
    const img = req.body.img
    const lat = req.body.latitude
    const long = req.body.longitude

    db.query("INSERT INTO profile.Posts (Username, Image, PostDes,Latitude,Longitude) VALUES (?,?,?,?,?)", [username, img, description,lat,long],
    (err, result)=>{
        if(err) {
            console.log("setdetails error " +err);
        }
        res.send(result)
        console.log("posts error " + err)
        console.log(result)
    });
});

app.post('/updateScore', (req, res) => {
    const username = req.body.username


    db.query("UPDATE profile.profile SET points = points + 50 WHERE username = ?", [username],
    (err, result)=>{
        if(err) {
            console.log("updateScore error " +err);
        }
        res.send(result)
        console.log("updateScore2 error " + err)
        console.log(result)
    });
});

app.post('/tags', (req, res) => {
    const tags = req.body.tags
    const id = req.body.id

    tags.forEach(element =>
        db.query("INSERT INTO profile.interests (interestName) VALUES (?)", [element],
        (err, result)=>{
            if(err) {
                console.log(id);
                console.log("tags error " +err);
            }

            db.query("INSERT INTO profile.posttags (InterestID, PostID) VALUES ((SELECT InterestID FROM profile.interests WHERE interestName=?), (SELECT PostID FROM profile.posts WHERE PostID=?))", [element, id],
            (err, result)=>{
                if(err) {
                    console.log("tags1 error " +err);
                }
                console.log(result)
                })
            console.log(result)
        })
    )
});

app.post('/setInterest', (req, res) => {
    const interests = req.body.interests
    const username = req.body.username

    for(i = 0; i < interests.length; i++){
      console.log(interests[i]);
      console.log("Your username is " + username);
        db.query("INSERT INTO profile.userinterests (InterestID, UserID) VALUES ((SELECT InterestID FROM profile.Interests WHERE interestName=?),(SELECT userID FROM profile.userdetails WHERE username=?));", [interests[i], username],
        (err, result)=>{
            if(err) {
                console.log("setinterest error " +err);
            }
            console.log("interest error " + err)
            console.log("interest result " + result)
        });
    }
});

app.get('/getInterests', (req, res) => {

        db.query("SELECT interestName FROM profile.interests",
        (err, result)=>{
            if(err) {
                console.log("getinterest error " +err);
            }
            res.send(result);
            console.log("getinterest error " + err)
            console.log("getinterest result " + result)
        });
});

app.get('/getUsers', (req, res) => {

    db.query("SELECT username FROM profile.userdetails",
    (err, result)=>{
        if(err) {
            console.log("getuser error " +err);
        }
        res.send(result);
        console.log("getuser error " + err)
        console.log("getuser result " + result)
    });
});

app.post('/users', (req, res) => {
    const username = req.body.username
    db.query("SELECT * FROM profile.profile WHERE username =?;", [username], (err, results) => {
      if(err){
          console.log("profile err " + err)
      }
      res.send(results);
    });
  });

  app.post('/update',(req,res) => {
    const username = req.body.username
    const fname = req.body.fname
    const lname = req.body.lname
    const comm_email = req.body.commEmail
    const image = req.body.image

      db.query("UPDATE profile.profile SET fname = ?, lname = ?, comm_email = ? WHERE username = ?", [fname,lname,comm_email,username], (err, result) =>{
        if (err) throw err;
        res.send(result);
        });
  });

  app.post('/updateAvatar', (req, res) => {
      const img = req.body.img;
      const id = req.query.profileID;
      db.query('update profile.profile set image = ? where profileID = ?',
          [img, id],
          (err, result) => {
              if (err) throw err;
              res.send(result);
          }
      );
  });

  app.post('/updateBackgroundImage', (req, res) => {
      const img = req.body.img;
      const id = req.query.profileID;
      db.query('update profile.profile set backgroundImage = ? where profileID = ?',
          [img, id],
          (err, result) => {
              if (err) throw err;
              res.send(result);
          }
      );
  });


  app.post('/myposts',(req,res) => {
    const username = req.body.username
    db.query("SELECT * FROM profile.posts WHERE Username=? ORDER BY PostID DESC LIMIT 10", [username], (err, result) =>{
      if (err) throw err;
      res.send(result);
      });
  });

  app.post('/allposts',(req,res) => {
    db.query("SELECT * FROM profile.posts",(err,result) =>{
      if (err) throw err;
      res.send(result);
      });
  });

  app.post('/deletepost',(req,res) => {
    const postID = req.body.postid
    db.query("DELETE FROM profile.posts WHERE PostID=?",[postID],(err,result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });

  app.get('/getFollowedUsers', (req, res) => {
    const id = req.query.userId;
    db.query('select * from profile.follows where UserID = ?',
        [id],
        (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        }
    );
});

app.get('/getFans', (req, res) => {
    const id = req.query.userId;
    db.query('select * from profile.follows where FollowUserID = ?',
        [id],
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});

app.post('/search_users', (req, res) => {
    const name = req.body.name;
    const userID = req.body.userid;
    db.query('select * from profile.userdetails WHERE username like ? AND userID NOT IN (?) LIMIT 10 ',
        ['%' + name + '%', + userID],
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});

app.post('/follow', (req, res) => {
    const userId = req.body.userId;
    const followUserId = req.body.followUserId;
    db.query('insert into profile.follows (UserID, FollowUserID) VALUES (?, ?)',
        [userId, followUserId],
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});



{/*log server is running*/}
app.listen(3001, () =>{
    console.log("Running server")
})
