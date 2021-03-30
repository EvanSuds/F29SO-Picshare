import React from 'react';
import {BrowserRouter , Switch, Route, Link, Redirect, withRouter, useHistory }from "react-router-dom";
import './NavBar.css';
import Axios from 'axios';
import SideDrawerButton from '../SideDrawer/SideDrawerButton';

const navbar = props => (
    <header className="navbar">
        <nav className="navbarContent">
            <div>
                <SideDrawerButton click={props.drawerClickedHandler}/>
            </div>
            <div className="navbarLogo"><a href=''>PicShare</a></div>
            <div className="spacer"></div>
            <div className="navbarItems">
                <ul>
                    <li><Link to="/allNewsFeed">News Feed</Link></li>
                    <li><Link to="/explore">Explore</Link></li>
                    <li><Link to="/profile">My Profile</Link></li>
                    <div class="dropdown">
                        <button class="dropbtn"><Link to="/profile">More Options</Link></button>
                        <div class="dropdown-content">
                            <a href="/">Logout</a>
                            <a href="#">Settings</a>
                            <a href="#">Privacy Policy</a>
                        </div>
                    </div>
                </ul>
            </div>
        </nav>

    </header>
);



export default navbar;
