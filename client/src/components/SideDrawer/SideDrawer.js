import React from 'react';
import './SideDrawer.css';

const sideDrawer = props => (

    <nav className='sideDrawerContent' >
        <ul>
            <li><a href='/allNewsfeed'>News Feed</a></li>
            <li><a href='/explore'>Explore</a></li>
            <li><a href='/'>Logout</a></li>
            <li><a href='/profile'>My Account</a></li>
            <li><a href=''>Settings</a></li>
            <li><a href=''>Privacy Policy</a></li>
        </ul>
    </nav>
);

export default sideDrawer;
