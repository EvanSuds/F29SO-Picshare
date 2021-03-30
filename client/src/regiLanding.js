import React, {useState, useEffect}       from 'react';
import {withRouter, useHistory, BrowserRouter , Switch, Route, Link, Redirect} from "react-router-dom";
import Profile from "./profile";
import "./regiLand.css";
import Button from "react-bootstrap/Button";

import setisLoggedIn from "./App";
import Axios from 'axios';

function RegiLanding() {
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pickedInterests, setPicked] = useState([]);
    const [hasAgreed, sethasAgreed] = useState(false);
    const [feedbackStatus, setFeedbackStatus] = useState('');
    const [fstname, setFstname] = useState('');
    const [sndname, setSndname] = useState('');
    const [regi, setisRegi] = useState('');
    const [entry, setEntry] = useState('');
    const [user, setUser] = useState('');
    const [response, setResponse] = useState([]);
    const [interests, setInterestList] = useState([]);
    //credintials for get, using axios
  Axios.defaults.withCredentials = true;


    const history = useHistory();

    const redirect = (path) => {

        history.push(path);
      };

    const filteredInterest =
        interests.filter(interest => {
        return interest.toLowerCase().includes(searchTerm);
    })



    function addtoPicked(props) {
        setPicked([ ... pickedInterests,
            props
        ])
    }




    const removePicked = (props) => {
        setPicked(pickedInterests.filter(item => {
            return item !== props
        }))

    }

    function checkDisplayName(){
        var name = displayName.split(" ")
        setFstname(name.splice(0, 1))
        var sndnames = name.join(" ")
        setSndname(sndnames)

    }

    function checkAgreement() {
        if(hasAgreed){
            if(pickedInterests.length >= 3){
                if(displayName != ""){
                    //setisLoggedIn(true);
                    console.log(setisLoggedIn);
                    setdetails();
                    setInterests();
                    redirect("/profile")
                } else {
                    setFeedbackStatus("You must have a display name");
                }

            } else {
                setFeedbackStatus("You must pick at least 3 interests");
            }

        } else{
            setFeedbackStatus("You must agree to terms and conditions to continue");

        }
    }


    const printInterest =  filteredInterest.slice(0,10).map((item) =>
     <li className="searchItemsList" > <Button className="searchItems" key={item.name} onClick={() => {addtoPicked(item)}} > + {item}</Button> </li>

    );

    const printPickedInterest = pickedInterests.map((item) =>
     <Button className="searchItems" key={item.name} onClick={() => {removePicked(item)}} > - {item}</Button>

    );

    const setdetails = () => {
        Axios.post('http://localhost:3001/setDetails', {
            firstName: fstname,
            secondName: sndname,
            description: description,
            username: user


        }).then((response) => {
            if(response.data.message){
                setFeedbackStatus(response.data.message)
            }

        })
    }

    const setInterests = () => {
        Axios.post('http://localhost:3001/setInterest', {
            interests: pickedInterests,
            username: user


        }).then((response) => {
            if(response.data.message){
                setFeedbackStatus(response.data.message)
            }

        })
    }


    const getInterests = () => {
        Axios.get('http://localhost:3001/getInterests', {
        }).then((response) => {
            setResponse(response);
            initInterests();
        })
    }

    const initInterests = () => {
        setInterestList([]);
        console.log(response)
        if(typeof response.data !== 'undefined'){
            for(var i = 0; i < response.data.length; i++){
                setInterestList(interests => [...interests,response.data[i].interestName])
            }
        }

    }

//on page loading check if cookie exist for user being logged  in
useEffect( ()=> {
    getInterests();
    Axios.get('http://localhost:3001/checklogin').then((response)=> {
    if(response.data.loggedIn === true){
      setUser(response.data.user[0].username)
      //setStatus(response.data.user[0].Username);
      //setisLoggedIn(true);


    }

    });
  }, []);



    return (
        <div className="regiLanding">
            <div className="basic">
                <h1 className="headings">Set up  your profile</h1>
                <input className="displayName" type="text" placeholder="Your name" onChange={(e) => {
                checkDisplayName()
                setDisplayName(e.target.value);
                }}/>

              <textarea className="description" type="text" placeholder="Say a little bit about yourself... " onChange={(e) => {
                    setDescription(e.target.value);
                }}/>
            </div>





            <div className="interests">
                <h1 className="headings">Pick your interests</h1>
                <input className="searchbar" type="text" placeholder="Search" onChange={(e) => {
                getInterests();
                setSearchTerm(e.target.value);
                }}/>

                <div className="returnedInterest">

                        {(searchTerm !== "")?  <ul className="searchList">{printInterest}</ul>:null}

                        {printPickedInterest}




                </div>

            </div>
            <br></br>
            <div className="agreement">
                <p>I agree to Terms and Conditions</p><input onChange={() => sethasAgreed(true)}type="checkBox"></input>
                <br></br>
                <Button className="button" onClick={checkAgreement} >Continue</Button>
                <p className="headings">{feedbackStatus}</p>
            </div>
        </div>
    )
}

export default withRouter(RegiLanding);
